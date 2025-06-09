import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
} from '@nestjs/common';
import { GoalsService } from './goals.service';
import { GoalsDto } from './dto/goals.dto';

@Controller()
export class GoalsController {
  constructor(private readonly service: GoalsService) {}

  @Get('/get/goals')
  async getGoals() {
    return this.service.getGoals();
  }
  @Get('/get/goal/:id')
  async getUniqueGoal(@Param('id', ParseUUIDPipe) id: string) {
    return this.service.getUniqueGoal(id);
  }

  @Post('/create/goal')
  async createGoal(@Body() dto: GoalsDto) {
    return this.service.createGoal(dto);
  }
}
