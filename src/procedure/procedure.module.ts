import { Module } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ProcedureController } from './procedure.controller';

@Module({
  providers: [PrismaService],
  controllers: [ProcedureController],
})
export class ProcedureModule {}
