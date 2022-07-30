import { UnauthorizedException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

import { EmailService } from '../email.service';
import { PrismaService } from '../prisma.service';
import type { User } from '../users/entities/user.entity';
import { UsersService } from '../users/users.service';
import { PasswordService } from './password.service';

@Injectable()
export class AuthService {
  resetPasswordTokenExpirationInHours: number;

  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private passwordService: PasswordService,
    private configService: ConfigService,
    private db: PrismaService,
  ) {
    this.resetPasswordTokenExpirationInHours =
      configService.get<number>('RESET_PASSWORD_TOKEN_EXPIRATION_IN_HOURS') ||
      24;
  }

  async validateUser(email: string, password: string): Promise<User> {
    const user = await this.usersService.findOne({ email });
    if (!user) {
      throw new UnauthorizedException();
    }

    if (!this.passwordService.verify(password, user.hashedPassword)) {
      throw new UnauthorizedException();
    }

    return user;
  }

  async login(user: User) {
    const payload = { email: user.email, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async resetPassword(email: string) {
    const randomToken = this.passwordService.generateToken();
    const hashedToken = this.passwordService.hash256(randomToken);
    const expiresAt = new Date();
    expiresAt.setHours(
      expiresAt.getHours() + this.resetPasswordTokenExpirationInHours,
    );

    // Delete all existing tokens
    await this.db.token.deleteMany({
      where: { type: 'RESET_PASSWORD', user: { email } },
    });

    // Create a new token
    const token = await this.db.token.create({
      data: {
        user: { connect: { email } },
        sentTo: email,
        hashedToken,
        type: 'RESET_PASSWORD',
        expiresAt,
      },
    });

    return {
      ...token,
      randomToken,
    };
  }

  async changePasswordWithToken(token: string, password: string) {
    const hashedToken = this.passwordService.hash256(token);
    const savedToken = await this.db.token.findFirst({
      where: { hashedToken, type: 'RESET_PASSWORD' },
      include: { user: true },
    });

    if (!savedToken) {
      throw new UnauthorizedException();
    }

    await this.db.token.delete({ where: { id: savedToken.id } });

    if (savedToken.expiresAt < new Date()) {
      throw new UnauthorizedException();
    }

    const hashedPassword = await this.passwordService.hash(password);
    await this.db.user.update({
      where: { id: savedToken.userId },
      data: { hashedPassword },
    });
  }

  async changePassword(user: User, oldPassword: string, newPassword: string) {
    if (!this.passwordService.verify(oldPassword, user.hashedPassword)) {
      throw new UnauthorizedException();
    }

    const hashedPassword = await this.passwordService.hash(newPassword);
    await this.db.user.update({
      data: { hashedPassword },
      where: { id: user.id },
    });
  }
}
