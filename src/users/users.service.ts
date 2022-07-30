import { Injectable } from '@nestjs/common';
import type { Prisma } from '@prisma/client';

import { PasswordService } from '../auth/password.service';
import { PrismaService } from '../prisma.service';
import type { CreateUserInput } from './dto/create-user.input';
import type { UpdateUserInput } from './dto/update-user.input';

@Injectable()
export class UsersService {
  constructor(
    private db: PrismaService,
    private passwordService: PasswordService,
  ) {}

  async create(createUserInput: CreateUserInput) {
    const hashedPassword = await this.passwordService.hash(
      createUserInput.password,
    );

    return this.db.user.create({
      data: {
        email: createUserInput.email,
        hashedPassword,
      },
    });
  }

  async findMany(params?: {
    skip?: number;
    take?: number;
    cursor?: Prisma.UserWhereUniqueInput;
    where?: Prisma.UserWhereInput;
    orderBy?: Prisma.UserOrderByWithRelationInput;
  }) {
    return this.db.user.findMany(params);
  }

  async findOne(where: Prisma.UserWhereUniqueInput) {
    return this.db.user.findFirst({
      where,
    });
  }

  async update(id: string, updateUserInput: UpdateUserInput) {
    let hashedPassword: string | undefined = undefined;
    if (updateUserInput.password) {
      hashedPassword = await this.passwordService.hash(
        updateUserInput.password,
      );
    }

    return this.db.user.update({
      where: {
        id,
      },
      data: {
        hashedPassword,
      },
    });
  }

  remove(id: string) {
    return this.db.user.delete({
      where: {
        id,
      },
    });
  }
}
