import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request, Response } from 'express';
import { LoginDto, RegisterDto } from './dto/auth.dto';
import { compare, hash } from 'bcrypt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
import { QuerySchemaService } from '../../utils/querySchema.util';
import resSuccess from '../../utils/resSuccess';
import { resReject } from '../../utils/resReject';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly envConfig: ConfigService,
    private readonly prisma: PrismaService,
    private readonly querySchema: QuerySchemaService,
  ) {}

  async access_code() {
    try {
      const inputParam = {
        execution: 'get_accessCode',
        user_id: null,
        request: null,
      };

      const { result } = await this.querySchema.queryRaw({ inputParam });

      console.log(result);

      return {
        result,
        message: 'successfully getting data in /auth/access_code',
        statusCode: HttpStatus.OK,
      };
    } catch (e) {
      console.log(e);
      throw new HttpException(
        {
          message: `Something wrong in getting data in /auth/access_code`,
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async register(res: Response, dto: RegisterDto) {
    try {
      const inputParam = {
        execution: 'register_user',
        user_id: null,
        request: {
          item: [
            {
              username: dto.username,
              phone: dto.phone,
              password: await hash(dto.password, 12),
              role_id: dto.role_id,
            },
          ],
        },
      };

      const { result } = await this.querySchema.queryRaw({ inputParam });

      if (result.code === 409) {
        throw new HttpException(
          {
            message: {
              english: `user with this role: ${dto.role} already exists`,
              persian: 'کاربر با مشخصات وارد شده ثبت نام شده است',
            },
            statusCode: HttpStatus.CONFLICT,
          },
          HttpStatus.CONFLICT,
        );
      }

      const payload = {
        sub: result.item.user_id,
        rl: result.item.role_id,
      };

      const JsonWebToken = this.jwtService.sign(payload, {
        secret: this.envConfig.get('JWT_SECRET'),
        expiresIn: '7d', // انقضای ۷ روزه
      });

      res.cookie(dto.role, JsonWebToken, {
        httpOnly: true,
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 روز
        sameSite: 'strict', // یا 'strict' یا 'none' (برای کراس‌دومین)
        secure: false, // روی HTTPS true باشه
      });

      return resSuccess({
        result: null,
        path: '/auth/register',
        message: {
          english: `registration was successful`,
          persian: 'ثبت نام با موفقیت انجام شد',
        },
        statusCode: HttpStatus.OK,
      });
    } catch (e) {
      console.log(e);
      //prettier-ignore

      resReject({
        statusCode : e.response.statusCode,
        message : {
          english : e.response.message.english,
          persian : e.response.message.persian
        },
        path : "/auth/register"
      })
    }
  }

  async login(res: Response, dto: LoginDto) {
    try {
      const inputParam = {
        execution: 'login_user',
        user_id: null,
        request: {
          phone: dto.phone,
          password: await hash(dto.password, 12),
          role_id: dto.role_id,
        },
      };

      const { result } = await this.querySchema.queryRaw({ inputParam });

      console.log(result);

      if (result.code === 409) {
        throw new HttpException(
          {
            message: {
              english: 'Incorrect phone or password. Please try again',
              persian: 'شماره تلفن یا رمز عبور اشتباه است',
            },
            statusCode: HttpStatus.UNAUTHORIZED,
          },
          HttpStatus.UNAUTHORIZED,
        );
      }

      const comparePass = await compare(dto?.password, result?.item?.password);

      if (!comparePass) {
        throw new HttpException(
          {
            message: {
              english: 'Incorrect phone or password. Please try again',
              persian: 'شماره تلفن یا رمز عبور اشتباه است',
            },
            statusCode: HttpStatus.UNAUTHORIZED,
          },
          HttpStatus.UNAUTHORIZED,
        );
      }

      console.log(result);

      const payload = {
        sub: result.item.user_id,
        rl: result.item.role_id,
      };

      const JsonWebToken = this.jwtService.sign(payload, {
        secret: this.envConfig.get('JWT_SECRET'),
        expiresIn: '7d', // انقضای ۷ روزه
      });

      res.cookie(dto.role, JsonWebToken, {
        httpOnly: true,
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 روز
        sameSite: 'lax',
        secure: false,
      });

      return resSuccess({
        path: '/auth/login',
        message: {
          english: 'Login was successful',
          persian: 'ورود با موفقیت انجام شد.',
        },
        statusCode: HttpStatus.OK,
        result,
      });
    } catch (error) {
      console.log(error);
      resReject({
        path: '/auth/login',
        message: {
          english: error.response.message.english,
          persian: error.response.message.persian,
        },
        statusCode: error.response.statusCode,
      });
    }
  }

  async session(request: Request) {
    try {
      const user = request.user;
      return resSuccess({
        path: '/auth/session',
        result: user,
      });
    } catch (e) {
      console.log(e);
      resReject({
        path: '/auth/session',
      });
    }
  }
}
