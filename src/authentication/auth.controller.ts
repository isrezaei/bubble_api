import { Body, Controller, Post, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Response } from 'express';
import { LoginDto, RegisterDto } from './dto/auth.dto';

@Controller()
export class AuthController {
  constructor(private readonly service: AuthService) {}

  @Post('/auth/register')
  async register(
    @Res({ passthrough: true }) res: Response,
    @Body() dto: RegisterDto,
  ) {
    return this.service.register(res, dto);
  }

  @Post('/auth/login')
  async login(
    @Body() dto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.service.login(res, dto);
  }
}
