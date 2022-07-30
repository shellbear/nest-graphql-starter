import { Module } from '@nestjs/common';

import { PasswordService } from '../auth/password.service';
import { UsersService } from './users.service';
import { UsersResolver } from './users.resolver';
import { PrismaService } from '../prisma.service';

@Module({
  providers: [UsersResolver, UsersService, PrismaService, PasswordService],
  exports: [UsersService],
})
export class UsersModule {}
