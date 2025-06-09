import {
  ArrayNotEmpty,
  IsArray,
  IsDateString,
  IsNotEmpty,
  IsNumber,
  IsString,
  IsUUID,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

class TaskDto {
  @IsUUID()
  id: string;

  @IsUUID()
  @IsString()
  goalId: string;

  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsDateString()
  @IsNotEmpty()
  deadline: string;

  @IsNumber()
  @IsNotEmpty()
  weight: number;

  @IsString()
  status: string;
}

export class TasksDto {
  @IsArray()
  @ArrayNotEmpty()
  @ValidateNested({ each: true }) // برای اعتبارسنجی هر آیتم در آرایه به صورت جداگانه
  @Type(() => TaskDto) // برای تبدیل هر آیتم به نمونه‌ای از TaskDto
  tasks: TaskDto[];
}
