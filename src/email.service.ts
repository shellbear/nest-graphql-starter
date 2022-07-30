import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as previewEmail from 'preview-email';
import sendgrid from '@sendgrid/mail';

export interface Email {
  to: string;
  subject: string;
  from?: string;
  html: string;
}

@Injectable()
export class EmailService {
  defaultFromEmail: string;

  constructor(private configService: ConfigService) {
    if (configService.get('SENDGRID_API_KEY')) {
      sendgrid.setApiKey(configService.get('SENDGRID_API_KEY'));
    }

    this.defaultFromEmail =
      configService.get('DEFAULT_FROM_EMAIL') || 'no-reply@example.com';
  }

  async send(email: Email): Promise<void> {
    if (this.configService.get('SENDGRID_API_KEY')) {
      await sendgrid.send({
        from: this.defaultFromEmail,
        ...email,
      });
    } else {
      await previewEmail({
        from: this.defaultFromEmail,
        ...email,
      });
    }
  }

  async sendResetPasswordEmail(
    email: string,
    resetPasswordUrl: string,
  ): Promise<void> {
    return await this.send({
      to: email,
      subject: 'Reset password',
      html: `
        <p>
          To reset your password, click the link below:
        </p>
        <p>
          <a href="${resetPasswordUrl}">
            ${resetPasswordUrl}
          </a>
        </p>
      `,
    });
  }
}
