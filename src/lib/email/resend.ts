import { Resend } from 'resend';

/** Parameters for transactional e-mail via Resend. */
export interface SendEmailParams {
  to: string | string[];
  subject: string;
  html: string;
  text?: string;
  replyTo?: string;
}

/** Result of a send attempt. */
export interface SendEmailResult {
  id: string | null;
}

/**
 * Central Resend wrapper for Star Local SaaS e-mail.
 *
 * Reuses the existing `resend` package (also used by `/api/contact/`).
 * This phase defines the wrapper only — no e-mails are sent yet.
 */
export class ResendEmailService {
  private readonly client: Resend;
  private readonly fromEmail: string;

  constructor(apiKey: string, fromEmail: string) {
    this.client = new Resend(apiKey);
    this.fromEmail = fromEmail;
  }

  /**
   * Sends a transactional e-mail via Resend.
   * Not implemented in this phase — call sites will be added with magic link flow.
   */
  async send(_params: SendEmailParams): Promise<SendEmailResult> {
    void this.client;
    void this.fromEmail;
    throw new Error('ResendEmailService.send is not implemented yet.');
  }
}

/** Factory for a configured Resend e-mail service instance. */
export function createResendEmailService(apiKey: string, fromEmail: string): ResendEmailService {
  return new ResendEmailService(apiKey, fromEmail);
}
