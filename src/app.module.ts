import { Module } from '@nestjs/common';

import { PrismaModule } from './prisma/prisma.module';
import { GoalsModule } from './goals/goals.module';
import { TasksModule } from './tasks/tasks.module';
import { UsersModule } from './users/users.module';
import { ConfigModule } from '@nestjs/config';
import { ProcedureModule } from './procedure/procedure.module';
import { ShokrgozariModule } from './shokrgozari/shokrgozari.module';
import { AuthModule } from './authentication/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: '.env' }),
    PrismaModule,
    GoalsModule,
    TasksModule,
    UsersModule,
    ProcedureModule,
    ShokrgozariModule,
    AuthModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
