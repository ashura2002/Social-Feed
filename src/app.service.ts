import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Social feed with Oauth2.0 and Nodemailer';
  }
}
