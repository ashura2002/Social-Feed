import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import type { Transporter, SendMailOptions } from 'nodemailer';

@Injectable()
export class EmailService {
  private readonly transporter: Transporter;

  constructor(private readonly configService: ConfigService) {
    this.transporter = nodemailer.createTransport({
      host: this.configService.getOrThrow<string>('MAIL_HOST'),
      port: this.configService.getOrThrow<number>('MAIL_PORT'),
      auth: {
        user: this.configService.getOrThrow<string>('MAIL_USER'),
        pass: this.configService.getOrThrow<string>('MAIL_PASS'),
      },
    });
  }

  async sendVerificationCode(to: string, code: string): Promise<void> {
    const message: SendMailOptions = {
      from: this.configService.getOrThrow<string>('MAIL_USER'),
      to,
      subject: 'Social Feed',
      text: 'Your verification code will expire in 5 minutes.',
      html: `<p>Your verification code is <strong>${code}</strong></p>`,
    };

    try {
      await this.transporter.sendMail(message);
    } catch (err: unknown) {
      const error =
        err instanceof Error ? err : new Error('Unknown email error');
      throw new InternalServerErrorException(error.message);
    }
  }
}
