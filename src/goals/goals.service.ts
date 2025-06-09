import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { GoalsDto } from './dto/goals.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class GoalsService {
  constructor(private readonly prisma: PrismaService) {}

  async getGoals() {
    try {
      const goals = await this.prisma.goals.findMany({
        include: {
          tasks: true,
        },
      });

      return {
        goals,
        statusCode: HttpStatus.OK,
        message: '/get/goal was successfully. ✅',
      };
    } catch (e) {
      console.error(e);
      throw new HttpException(
        {
          message: 'Internal server error in /get/goal. 🔴',
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }
  async getUniqueGoal(id: string) {
    try {
      const goal = await this.prisma.goals.findUnique({
        where: { id },
        include: {
          tasks: true,
        },
      });

      return {
        goal,
        statusCode: HttpStatus.OK,
        message: '/get/goal/:id was successfully. ✅',
      };
    } catch (e) {
      console.error(e);
      throw new HttpException(
        {
          message: 'Internal server error in /get/goal/:id. 🔴',
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }
  async createGoal(dto: GoalsDto) {
    try {
      const goal = await this.prisma.goals.create({
        data: {
          ...dto,
        },
      });
      return {
        goal,
        statusCode: HttpStatus.OK,
        message: '/post/goal was successfully. ✅',
      };
    } catch (e) {
      console.error(e);
      throw new HttpException(
        {
          message: 'Internal server error in /post/goal. 🔴',
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
