import type {
  CreateMagicLinkInput,
  CreateMagicLinkResult,
  ValidateMagicLinkInput,
  ValidateMagicLinkResult,
} from './types';

/**
 * Creates a magic login link for the given e-mail address.
 *
 * Planned behaviour (not implemented in this phase):
 * - normalize and validate e-mail
 * - upsert user by e-mail
 * - generate cryptographically secure token
 * - store SHA-256 hash in `magic_links`
 * - set expiry (e.g. 15 minutes)
 * - send link via Resend wrapper
 */
export function createMagicLink(_input: CreateMagicLinkInput): Promise<CreateMagicLinkResult> {
  throw new Error('createMagicLink is not implemented yet.');
}

/**
 * Validates a one-time magic link token.
 *
 * Planned behaviour (not implemented in this phase):
 * - hash incoming token and look up `magic_links.token_hash`
 * - reject expired or used tokens
 * - mark token as used
 * - return authenticated user
 */
export function validateMagicLink(_input: ValidateMagicLinkInput): Promise<ValidateMagicLinkResult> {
  throw new Error('validateMagicLink is not implemented yet.');
}
