import {
  Controller,
  Request,
  Response,
  Post,
  UseGuards,
  Get,
} from '@nestjs/common';
import { FastifyReply } from 'fastify';

import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';
import { AuthService } from './auth/auth.service';
import { LocalAuthGuard } from './auth/guards/local-auth.guard';

@Controller()
export class AppController {
  constructor(private authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('auth/login')
  async login(@Request() req, @Response() res: FastifyReply) {
    const result = await this.authService.login(req.user);

    res.setCookie('access-token', result.access_token, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 7,
    });

    return result;
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }
}
