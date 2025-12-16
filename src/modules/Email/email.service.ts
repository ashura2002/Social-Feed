import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import nodemailer, { Transporter, SendMailOptions } from 'nodemailer';

@Injectable()
export class EmailService {
  private transporter: Transporter;

  constructor(private readonly configService: ConfigService) {
    const transport = nodemailer.createTransport({
      host: this.configService.get<string>('MAIL_HOST')!,
      port: this.configService.get<number>('MAIL_PORT')!,
      auth: {
        user: this.configService.get<string>('MAIL_USER')!,
        pass: this.configService.get<string>('MAIL_PASS')!,
      },
    });

    // Type-safe check before assignment
    if (
      !('sendMail' in transport) ||
      typeof transport.sendMail !== 'function'
    ) {
      throw new InternalServerErrorException(
        'Failed to create mail transporter',
      );
    }

    this.transporter = transport;
  }

  async sendVerificationCode(to: string, code: string) {
    const message: SendMailOptions = {
      from: this.configService.get<string>('MAIL_USER')!,
      to,
      subject: 'Social Feed',
      text: 'Your verification code will expire in 5 minutes.',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 480px; margin: auto; padding: 20px; background: #f5f6fa; border-radius: 10px; border: 1px solid #dcdde1;">
          <h2 style="text-align: center; color: #2f3640;">Your Verification Code</h2>
          <p style="font-size: 15px; color: #353b48;">
            Hello, here is your verification code.
            This code will <strong>expire in 5 minutes</strong>.
          </p>
          <div style="background: #ffffff; padding: 20px; border-radius: 8px; text-align: center; border: 1px solid #dcdde1;">
            <span style="font-size: 32px; font-weight: bold; letter-spacing: 4px; color: #e84118;">
              ${code}
            </span>
          </div>
          <p style="font-size: 14px; color: #718093; margin-top: 20px;">
            If you did not request this, you can safely ignore this email.
          </p>
          <p style="text-align: center; color: #7f8fa6; margin-top: 30px; font-size: 12px;">
            © ${new Date().getFullYear()} Social Feed
          </p>
        </div>
      `,
    };

    try {
      await this.transporter.sendMail(message);
    } catch (err: unknown) {
      const error =
        err instanceof Error ? err : new Error('Unknown email error');
      console.error('Email error:', error.message);
      throw new InternalServerErrorException(
        'Failed to send verification email',
      );
    }
  }
}
