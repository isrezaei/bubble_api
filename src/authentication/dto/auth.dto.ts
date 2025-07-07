import {
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
  username: string;

  // @IsEmail()
  // @IsOptional()
  // @IsNotEmpty()
  // email: string;

  @IsString()
  @IsOptional()
  phone: number;

  @IsString()
  @IsOptional()
  @IsNotEmpty()
  password: string;

  @IsEnum(Role, { message: 'role is not valid' })
  role: Role;

  @IsNumber()
  role_id: number;
}

export class LoginDto {
  // @IsString()
  // @IsNotEmpty()
  // @IsOptional()
  // username?: string;
  //
  // @IsEmail()
  // @IsNotEmpty()
  // @IsOptional()
  // email?: string;

  @IsNotEmpty()
  @IsString()
  phone: string;

  @IsString()
  password: string;

  @IsEnum(Role, { message: 'role is not valid' })
  role: Role;

  @IsNumber()
  role_id: number;
}
