import { InputType, Field } from '@nestjs/graphql';
import { IsEmail } from 'class-validator';

@InputType()
export class ResetPasswordInput {
  @IsEmail()
  @Field()
  email: string;
}
