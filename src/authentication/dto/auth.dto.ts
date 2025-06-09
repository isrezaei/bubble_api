import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

enum Role {
  ADMIN = 'admin',
  USER = 'user',
  SUPPORT = 'support',
  DEVELOPER = 'developer',
}

export class RegisterDto {
  @IsString()
  @IsNotEmpty()
  user_name: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsEnum(Role, { message: 'role is not valid' })
  role: Role;

  @IsNumber()
  role_id: number;
}

export class LoginDto {
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  user_name?: string;

  @IsEmail()
  @IsNotEmpty()
  @IsOptional()
  email?: string;

  @IsString()
  password: string;

  @IsEnum(Role, { message: 'role is not valid' })
  role: Role;

  @IsNumber()
  role_id: number;
}
