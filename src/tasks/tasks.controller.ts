import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
} from '@nestjs/common';
import { TasksDto } from './dto/task.dto';
import { TasksService } from './tasks.service';

@Controller()
export class TasksController {
  constructor(private readonly service: TasksService) {}

  @Get('/get/tasks/:goalId')
  async gatUniqueTask(@Param('goalId', ParseUUIDPipe) goalId: string) {
    return this.service.getUniqueTask(goalId);
  }

  @Post('/create/tasks')
  async createTasks(@Body() dto: TasksDto) {
    console.log(dto);

    return this.service.createTasks(dto);
  }
}
