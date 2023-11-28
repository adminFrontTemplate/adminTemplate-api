//src/auth/auth.controller.ts

import { Body, Controller, Post, Get, Query, Request } from '@nestjs/common';
import { AuthService } from './auth.service';
import {
  ApiOkResponse,
  ApiTags,
  ApiCreatedResponse,
  ApiQuery,
} from '@nestjs/swagger';
import { AuthEntity } from './entity/auth.entity';
import { LoginDto, RegisterDto, SendEmailDto } from './dto/login.dto';

@Controller('auth')
@ApiTags('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @ApiOkResponse({ type: AuthEntity })
  login(@Body() { email, password }: LoginDto) {
    return this.authService.login(email, password);
  }

  @Post('loginOut')
  @ApiOkResponse({ type: AuthEntity })
  loginOut(@Body() {}, @Request() req) {
    return this.authService.loginOut(req.user);
  }

  @Post('register')
  @ApiCreatedResponse({ type: AuthEntity })
  register(@Body() { email, password, name, phone, code }: RegisterDto) {
    return this.authService.register(email, password, name, phone, code);
  }

  @Get('findEmail')
  @ApiOkResponse({ type: AuthEntity })
  @ApiQuery({ name: 'email', required: true, type: String })
  emailFindUser(@Query('email') email = '') {
    return this.authService.emailFindUser(email);
  }

  @Post('sendEmail')
  @ApiOkResponse()
  sendEmail(@Body() { email }: SendEmailDto) {
    return this.authService.sendEmail(email);
  }
}
