import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

import { EmailService } from '../email.service';
import { UsersModule } from '../users/users.module';
import { AuthService } from './auth.service';
import { LocalStrategy } from './local.strategy';
import { JwtStrategy } from './jwt.strategy';
import { PrismaService } from '../prisma.service';
import { PasswordService } from './password.service';
import { AuthResolver } from './auth.resolver';

@Module({
  imports: [
    UsersModule,
    PassportModule,
    JwtModule.registerAsync({
      useFactory: (config: ConfigService) => ({
        secret: config.get<string>('JWT_SECRET_KEY'),
        signOptions: {
          expiresIn:
            config.get<string | number>('JWT_EXPIRATION_TIME') || '14d',
        },
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [
    AuthResolver,
    AuthService,
    LocalStrategy,
    JwtStrategy,
    PrismaService,
    PasswordService,
    EmailService,
  ],
  exports: [AuthService],
})
export class AuthModule {}
