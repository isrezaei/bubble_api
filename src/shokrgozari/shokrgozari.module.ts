import { Module } from '@nestjs/common';
import { ShokrgozariService } from './shokrgozari.service';
import { ShokrgozariController } from './shokrgozari.controller';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  providers: [ShokrgozariService, PrismaService],
  controllers: [ShokrgozariController],
})
export class ShokrgozariModule {}
