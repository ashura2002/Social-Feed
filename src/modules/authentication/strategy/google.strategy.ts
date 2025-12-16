import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, Profile } from 'passport-google-oauth20';

export interface GoogleUserPayload {
  email: string;
  displayName: string;
}

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(private readonly configService: ConfigService) {
    super({
      clientID: configService.getOrThrow<string>('GOOGLE_CLIENT_ID'),
      clientSecret: configService.getOrThrow<string>('GOOGLE_CLIENT_SECRET'),
      callbackURL: 'http://localhost:8000/authentication/google/redirect',
      scope: ['email', 'profile'],
    });
  }

  validate(
    accessToken: string,
    refreshToken: string,
    profile: Profile,
  ): GoogleUserPayload {
    const email = profile.emails?.[0]?.value;

    if (!email) {
      throw new Error('Google account does not have an email');
    }

    return {
      email,
      displayName: profile.displayName,
    };
  }
}
