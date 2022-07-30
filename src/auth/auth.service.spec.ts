import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import type { TestingModule } from '@nestjs/testing';
import { Test } from '@nestjs/testing';

import { UsersModule } from '..//users/users.module';
import { PrismaService } from '../prisma.service';
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt.strategy';
import { LocalStrategy } from './local.strategy';
import { PasswordService } from './password.service';

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        UsersModule,
        JwtModule.register({
          secret: 'secret',
        }),
      ],
      providers: [
        AuthService,
        LocalStrategy,
        JwtStrategy,
        PrismaService,
        PasswordService,
        ConfigService,
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
