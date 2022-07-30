import { Resolver, Mutation, Args } from '@nestjs/graphql';

import { EmailService } from '../email.service';
import { AuthService } from './auth.service';
import { ResetPasswordInput } from './dto/reset-password.input';

@Resolver()
export class AuthResolver {
  constructor(
    private readonly authService: AuthService,
    private readonly emailService: EmailService,
  ) {}

  @Mutation(() => Boolean)
  async resetPassword(
    @Args('resetPasswordInput')
    { email }: ResetPasswordInput,
  ) {
    const { randomToken } = await this.authService.resetPassword(email);
    await this.emailService.sendResetPasswordEmail(
      email,
      `https://example.com/reset-password/${randomToken}`,
    );

    return true;
  }
}
