import { Module } from '@nestjs/common';
import { AuthenticationService } from './authentication.service';
import { AuthenticationController } from './authentication.controller';
import { UsersModule } from '../users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../users/entity/user.entity';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtConfigOptions } from 'src/config/jwt.config';
import { GoogleStrategy } from './strategy/google.strategy';
import { EmailModule } from '../Email/email.module';
import { UserVerification } from './entity/user-verification.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, UserVerification]),
    UsersModule,
    EmailModule,
    ConfigModule.forRoot(),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: JwtConfigOptions,
    }),
  ],
  controllers: [AuthenticationController],
  providers: [AuthenticationService, GoogleStrategy],
})
export class AuthenticationModule {}
