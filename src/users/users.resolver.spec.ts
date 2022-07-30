import type { TestingModule } from '@nestjs/testing';
import { Test } from '@nestjs/testing';

import { PrismaService } from '../prisma.service';
import { PasswordService } from '..//auth/password.service';
import { UsersResolver } from './users.resolver';
import { UsersService } from './users.service';

describe('UsersResolver', () => {
  let resolver: UsersResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UsersResolver, UsersService, PrismaService, PasswordService],
    }).compile();

    resolver = module.get<UsersResolver>(UsersResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
