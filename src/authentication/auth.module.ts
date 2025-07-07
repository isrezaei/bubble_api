import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './strategy/jwt.strategy';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { QuerySchemaService } from '../../utils/querySchema.util';

@Module({
  providers: [
    AuthService,
    JwtService,
    JwtStrategy,
    PrismaService,
    QuerySchemaService,
  ],
  controllers: [AuthController],
})
export class AuthModule {}
