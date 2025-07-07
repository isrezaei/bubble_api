import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { Request, Response } from 'express';
import { LoginDto, RegisterDto } from './dto/auth.dto';
import { JwtAuthGuard } from './guard/auth.guard';

@Controller()
export class AuthController {
  constructor(private readonly service: AuthService) {}

  @Get('/auth/access_code')
  async access_code() {
    return this.service.access_code();
  }

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

  @UseGuards(JwtAuthGuard)
  @Get('/auth/session')
  async session(@Req() request: Request) {
    return this.service.session(request);
  }
}
