import { ConfigService } from '@nestjs/config';
import { JwtSignOptions } from '@nestjs/jwt';

export const JwtConfigOptions = (config: ConfigService) => ({
  secret: config.get<string>('JWT_SECRET'),
  signOptions: {
    expiresIn: config.get<string>(
      'JWT_EXPIRES_IN',
    ) as JwtSignOptions['expiresIn'],
  },
});
