import type { D1Database } from '../db/d1';
import { createResendEmailService } from '../email/resend';
import { renderMagicLinkEmail, buildMagicLinkUrl } from '../email/magic-link-template';
import { CustomerRepository, WebsitePermissionRepository } from '../customer-portal/repositories';
import { AuthRateLimitService, clientIp } from '../customer-portal/rate-limit';
import { isAdminEmail } from './admin-guard';
import { AUTH_ROUTES, EMAIL_PATTERN, MAGIC_LINK_TTL_SECONDS, SESSION_COOKIE_NAME, SESSION_TTL_SECONDS } from './constants';
import { generateSecureToken, hashSecret, normalizeEmail } from './crypto';
import { AuthValidationError, MagicLinkExpiredError, MagicLinkInvalidError } from './errors';
import { AuthRepository } from './repository';
import type {
  AuthSessionContext,
  CreateMagicLinkInput,
  CreateMagicLinkResult,
  CreateSessionInput,
  CreateSessionResult,
  DestroySessionInput,
  ValidateMagicLinkInput,
  ValidateMagicLinkResult,
} from './types';
import type { User } from '../../types/auth';

const LOGIN_TIMING_DELAY_MS = 400;

export interface AuthServiceOptions {
  resendApiKey?: string;
  fromEmail?: string;
  origin?: string;
}

export class AuthService {
  private readonly repo: AuthRepository;
  private readonly customers: CustomerRepository;
  private readonly permissions: WebsitePermissionRepository;
  private readonly rateLimit: AuthRateLimitService;

  constructor(
    db: D1Database,
    private readonly options: AuthServiceOptions = {},
  ) {
    this.repo = new AuthRepository(db);
    this.customers = new CustomerRepository(db);
    this.permissions = new WebsitePermissionRepository(db);
    this.rateLimit = new AuthRateLimitService(db);
  }

  async requestMagicLink(input: CreateMagicLinkInput, request?: Request): Promise<CreateMagicLinkResult> {
    const email = normalizeEmail(input.email);
    if (!EMAIL_PATTERN.test(email)) {
      throw new AuthValidationError('Voer een geldig e-mailadres in.');
    }

    if (request) {
      await this.rateLimit.purgeExpired();
      const ip = clientIp(request);
      const emailLimit = await this.rateLimit.checkAndIncrement('magic-link:email', email);
      if (!emailLimit.allowed) {
        throw new AuthValidationError(`Te veel pogingen. Probeer het over ${emailLimit.retryAfterSeconds ?? 60} seconden opnieuw.`);
      }
      const ipLimit = await this.rateLimit.checkAndIncrement('magic-link:ip', ip);
      if (!ipLimit.allowed) {
        throw new AuthValidationError('Te veel verzoeken vanaf dit netwerk. Probeer het later opnieuw.');
      }
    }

    await this.repo.purgeExpiredMagicLinks();

    if (input.existingCustomerOnly) {
      return this.requestExistingCustomerMagicLink(email, input);
    }

    return this.requestOnboardingMagicLink(email, input);
  }

  /** Public /login/ — no auto-registration; privacy-safe suppression for unknown e-mails. */
  private async requestExistingCustomerMagicLink(
    email: string,
    input: CreateMagicLinkInput,
  ): Promise<CreateMagicLinkResult> {
    const eligibleCustomer = await this.customers.findLoginEligibleByEmail(email);
    const adminEligible = isAdminEmail(email);

    if (!eligibleCustomer && !adminEligible) {
      await delayForLoginTiming();
      return { magicLink: null, plainToken: null, emailSent: true, suppressed: true };
    }

    await delayForLoginTiming();

    let user: User;
    let customerId: string | null = null;

    if (eligibleCustomer) {
      user = eligibleCustomer.userId
        ? (await this.repo.findUserById(eligibleCustomer.userId)) ?? (await this.repo.upsertUserByEmail(email))
        : await this.repo.upsertUserByEmail(email);
      if (!eligibleCustomer.userId) {
        await this.customers.linkUserToCustomer(eligibleCustomer.id, user.id);
      }
      customerId = eligibleCustomer.id;
    } else {
      user = await this.repo.upsertUserByEmail(email);
    }

    return this.issueMagicLink({
      user,
      email,
      tenantId: input.tenantId ?? null,
      customerId,
      origin: input.origin,
    });
  }

  /** Website save/publish onboarding — may create user + customer records. */
  private async requestOnboardingMagicLink(
    email: string,
    input: CreateMagicLinkInput,
  ): Promise<CreateMagicLinkResult> {
    const user = await this.repo.upsertUserByEmail(email);
    const customer = await this.customers.upsertFromUser({ userId: user.id, email });

    if (input.tenantId) {
      await this.repo.ensureTenantOwner(input.tenantId, user.id);
    }

    return this.issueMagicLink({
      user,
      email,
      tenantId: input.tenantId ?? null,
      customerId: customer.id,
      origin: input.origin,
    });
  }

  private async issueMagicLink(input: {
    user: User;
    email: string;
    tenantId: string | null;
    customerId: string | null;
    origin?: string;
  }): Promise<CreateMagicLinkResult> {
    await this.repo.deleteMagicLinksForUser(input.user.id);

    const plainToken = generateSecureToken(32);
    const tokenHash = await hashSecret(plainToken);
    const now = new Date();
    const expiresAt = new Date(now.getTime() + MAGIC_LINK_TTL_SECONDS * 1000).toISOString();

    const magicLink = await this.repo.createMagicLink({
      id: crypto.randomUUID(),
      userId: input.user.id,
      tenantId: input.tenantId,
      customerId: input.customerId,
      tokenHash,
      expiresAt,
      createdAt: now.toISOString(),
    });

    await this.sendMagicLinkEmail(
      input.email,
      plainToken,
      input.origin ?? this.options.origin ?? 'https://www.starlocal.nl',
    );

    const emailSent = Boolean(this.options.resendApiKey?.trim() && this.options.fromEmail?.trim());

    return { magicLink, plainToken, emailSent };
  }

  async validateMagicLink(input: ValidateMagicLinkInput): Promise<ValidateMagicLinkResult> {
    const plainToken = input.plainToken.trim();
    if (!plainToken) throw new MagicLinkInvalidError();

    const tokenHash = await hashSecret(plainToken);
    const magicLink = await this.repo.findMagicLinkByTokenHash(tokenHash);
    if (!magicLink) throw new MagicLinkInvalidError();

    if (new Date(magicLink.expiresAt).getTime() < Date.now()) {
      await this.repo.deleteMagicLink(magicLink.id);
      throw new MagicLinkExpiredError();
    }

    const user = await this.repo.findUserById(magicLink.userId);
    if (!user) throw new MagicLinkInvalidError();

    await this.repo.deleteMagicLink(magicLink.id);

    return { user, magicLink };
  }

  async createSession(input: CreateSessionInput): Promise<CreateSessionResult> {
    const plainToken = generateSecureToken(32);
    const tokenHash = await hashSecret(plainToken);
    const ttl = input.ttlSeconds ?? SESSION_TTL_SECONDS;
    const now = new Date();
    const expiresAt = new Date(now.getTime() + ttl * 1000).toISOString();

    const record = await this.repo.createSession({
      id: crypto.randomUUID(),
      userId: input.userId,
      tenantId: input.tenantId ?? null,
      customerId: input.customerId ?? null,
      tokenHash,
      expiresAt,
      createdAt: now.toISOString(),
    });

    return {
      session: {
        id: record.id,
        userId: record.userId,
        tenantId: record.tenantId,
        customerId: record.customerId,
        expiresAt: record.expiresAt,
        createdAt: record.createdAt,
      },
      sessionToken: plainToken,
    };
  }

  async destroySession(input: DestroySessionInput): Promise<void> {
    if (input.sessionToken) {
      const tokenHash = await hashSecret(input.sessionToken);
      await this.repo.deleteSessionByTokenHash(tokenHash);
      return;
    }
    if (input.sessionId) {
      await this.repo.deleteSessionById(input.sessionId);
    }
  }

  async getSessionFromToken(sessionToken: string | undefined | null): Promise<AuthSessionContext | null> {
    if (!sessionToken?.trim()) return null;

    const tokenHash = await hashSecret(sessionToken.trim());
    const record = await this.repo.findSessionByTokenHash(tokenHash);
    if (!record) return null;

    if (new Date(record.expiresAt).getTime() < Date.now()) {
      await this.repo.deleteSessionByTokenHash(tokenHash);
      return null;
    }

    const user = await this.repo.findUserById(record.userId);
    if (!user) return null;

    return {
      sessionToken: sessionToken.trim(),
      user,
      session: {
        id: record.id,
        userId: record.userId,
        tenantId: record.tenantId,
        customerId: record.customerId,
        expiresAt: record.expiresAt,
        createdAt: record.createdAt,
      },
    };
  }

  async activateAccountFromMagicLink(
    plainToken: string,
    fallbackRedirectPath?: string | null,
  ): Promise<{ session: CreateSessionResult; redirectPath: string }> {
    const { user, magicLink } = await this.validateMagicLink({ plainToken });
    const customer = await this.customers.findByEmail(user.email);
    const isAdmin = isAdminEmail(user.email);

    if (isAdmin) {
      const session = await this.createSession({
        userId: user.id,
        tenantId: magicLink.tenantId,
        customerId: customer?.id ?? magicLink.customerId ?? null,
      });
      const redirectPath =
        sanitizeAuthRedirectPath(fallbackRedirectPath) ??
        (magicLink.tenantId
          ? `${AUTH_ROUTES.dashboard}?tenantId=${encodeURIComponent(magicLink.tenantId)}`
          : AUTH_ROUTES.dashboard);
      return { session, redirectPath };
    }

    if (!customer || customer.status !== 'active') {
      throw new MagicLinkInvalidError();
    }

    const websites = await this.permissions.listWebsitesForCustomer(customer.id);
    if (websites.length === 0) {
      throw new MagicLinkInvalidError();
    }

    if (!customer.userId) {
      await this.customers.linkUserToCustomer(customer.id, user.id);
    }

    const tenantId =
      magicLink.tenantId && websites.some((site) => site.tenantId === magicLink.tenantId)
        ? magicLink.tenantId
        : websites[0]?.tenantId ?? null;

    const session = await this.createSession({
      userId: user.id,
      tenantId,
      customerId: customer.id,
    });

    const redirectPath =
      sanitizeAuthRedirectPath(fallbackRedirectPath) ??
      (tenantId ? `${AUTH_ROUTES.dashboard}?tenantId=${encodeURIComponent(tenantId)}` : AUTH_ROUTES.dashboard);

    return { session, redirectPath };
  }

  private async sendMagicLinkEmail(to: string, plainToken: string, origin: string): Promise<void> {
    const apiKey = this.options.resendApiKey?.trim();
    const fromEmail = this.options.fromEmail?.trim();
    if (!apiKey || !fromEmail) {
      console.warn('[auth] RESEND_API_KEY or FROM_EMAIL missing — magic link e-mail not sent.');
      return;
    }

    const magicUrl = buildMagicLinkUrl(origin, plainToken);
    const content = renderMagicLinkEmail({ magicUrl, minutesValid: MAGIC_LINK_TTL_SECONDS / 60 });
    const mailer = createResendEmailService(apiKey, fromEmail);
    await mailer.send({ to, subject: content.subject, html: content.html, text: content.text });
  }
}

export function createAuthService(db: D1Database, options: AuthServiceOptions = {}): AuthService {
  return new AuthService(db, options);
}

/** Only allow same-origin relative redirects after login. */
export function sanitizeAuthRedirectPath(value: string | null | undefined): string | null {
  if (!value) return null;
  const path = value.trim();
  if (!path.startsWith('/') || path.startsWith('//')) return null;
  return path;
}

function delayForLoginTiming(): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, LOGIN_TIMING_DELAY_MS));
}
