import { Resend } from 'resend';
import type { SendEmailParams, SendEmailResult } from './types';

export type { SendEmailParams, SendEmailResult } from './types';

/**
 * Central Resend wrapper for Star Local SaaS e-mail.
 */
export class ResendEmailService {
  private readonly client: Resend;
  private readonly fromEmail: string;

  constructor(apiKey: string, fromEmail: string) {
    this.client = new Resend(apiKey);
    this.fromEmail = fromEmail;
  }

  async send(params: SendEmailParams): Promise<SendEmailResult> {
    const to = Array.isArray(params.to) ? params.to : [params.to];
    const { data, error } = await this.client.emails.send({
      from: this.fromEmail,
      to,
      subject: params.subject,
      html: params.html,
      text: params.text,
      replyTo: params.replyTo,
    });

    if (error) {
      throw new Error(error.message || 'E-mail verzenden mislukt.');
    }

    return { id: data?.id ?? null };
  }
}

export function createResendEmailService(apiKey: string, fromEmail: string): ResendEmailService {
  return new ResendEmailService(apiKey, fromEmail);
}
