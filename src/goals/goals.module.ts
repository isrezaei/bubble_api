import { Module } from '@nestjs/common';
import { GoalsService } from './goals.service';
import { GoalsController } from './goals.controller';
import { PrismaService } from '../prisma/prisma.service';
import { ConfigService } from '@nestjs/config';

@Module({
  providers: [GoalsService ,PrismaService , ConfigService],
  controllers: [GoalsController]
})
export class GoalsModule {}
