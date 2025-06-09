import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { TasksDto } from './dto/task.dto';

@Injectable()
export class TasksService {
  constructor(private readonly prisma: PrismaService) {}

  async getUniqueTask(goalId: string) {
    try {
      const task = await this.prisma.tasks.findMany({
        where: {
          goalId,
        },
        include: {
          goal: true,
        },
      });

      console.log(task);

      return {
        task,
        stausCode: HttpStatus.OK,
      };
    } catch (e) {
      console.log(e);
      throw new HttpException({}, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async createTasks(dto: TasksDto) {
    console.log(dto.tasks);

    try {
      const tasks = await this.prisma.tasks.createMany({
        data: dto.tasks,
      });
      return {
        tasks,
        statusCode: HttpStatus.OK,
        message: '/create/tasks was successfully. ✅',
      };
    } catch (e) {
      console.error(e);
      throw new HttpException(
        {
          message: 'Internal server error in /create/tasks. 🔴',
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
