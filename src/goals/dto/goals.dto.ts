import {  IsDateString, IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';


export class GoalsDto {

  @IsUUID()
  id : string

  @IsOptional()
  @IsUUID()
  userId? : string

  @IsNotEmpty()
  @IsString()
  title : string

  @IsOptional()
  @IsString()
  description : string

  @IsDateString()
  createdAt : string

  @IsOptional()
  @IsDateString()
  updatedAt : string

}
