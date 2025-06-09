import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './strategy/jwt.strategy';
import { JwtService } from '@nestjs/jwt';

@Module({
  providers: [AuthService, JwtService, JwtStrategy],
  controllers: [AuthController],
})
export class AuthModule {}
