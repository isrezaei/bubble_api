import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Response } from 'express';
import { LoginDto, RegisterDto } from './dto/auth.dto';
import { find } from 'lodash';
import { compare, hash } from 'bcrypt';
import { ConfigService } from '@nestjs/config';

const core_users = [
  {
    id: 1,
    user_name: 'farazmand',
    email: 'x@yahoo.com',
    password: '$2b$12$4VLmUXLu6V/bpSPjrNttEOrx5cqyH8SfkUN97dkeAS.p7Qkcy9og.',
    role_id: 3,
  },
  {
    id: 2,
    user_name: 'jafari',
    email: 'y@yahoo.com',
    password: '$2b$12$2Hk3HQXp2hPKsS/9T6Ky.exMxDXJjOsbdP/l1oS0scS7S.Mwc3aoy',
    role_id: 3,
  },
  {
    id: 2,
    user_name: 'rahimian',
    email: 'z@yahoo.com',
    password: '$2b$12$0MP.yGpUSSd0bkctV/2kt.ZoyNq3Fp1oeUANxeH0scQNUIi.0QKwG',
    role_id: 3,
  },
  {
    id: 4,
    user_name: 'laleh',
    email: 'npc@yahoo.com',
    password: '$2b$12$s7T/5R7SqQ4vZ1Z6a0SlTe9L3mBfsgCtPxTWfjCgw9C5BV3hd7iAu',
    role_id: 4,
  },
];

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly envConfig: ConfigService,
  ) {}

  async register(res: Response, dto: RegisterDto) {
    try {
      //*Check Exist Logic
      const existUser = {
        by_username: find(core_users, { user_name: dto.user_name }),
        by_email: find(core_users, { email: dto.email }),
      };

      console.log(existUser);

      if (existUser.by_email || existUser.by_username) {
        return {
          message: `user with this role : ${dto.role} already exists`,
          statusCode: HttpStatus.CONFLICT,
        };
      }
      //*Check Exist Logic

      //? Create new user with Specific role

      const newUser = {
        user_name: dto.user_name,
        email: dto.email,
        password: await hash(dto.password, 12),
        role_id: dto.role_id,
      };

      const createUser = [...core_users, newUser];

      //! Dd InputParam

      const inputParam = {
        execution: 'retrieve_auth',
        user_id: 5, //!---> ?,
        request: {
          item: [newUser],
        },
      };

      //? Create new user with Specific role

      const payload = {
        sub: '---', //! IDK
        email: dto.email,
        role_id: dto.role_id,
      };

      const JsonWebToken = this.jwtService.sign(payload, {
        secret: this.envConfig.get('JWT_SECRET'),
        expiresIn: '7d', // انقضای ۷ روزه
      });

      res.cookie(dto.role, JsonWebToken, {
        httpOnly: true,
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 روز
        sameSite: 'lax', // یا 'strict' یا 'none' (برای کراس‌دومین)
        secure: false, // روی HTTPS true باشه
      });

      return {
        fakeData: createUser,
        message: `user with this role : ${dto.role} submit successfully`,
        statusCode: HttpStatus.OK,
      };
    } catch (e) {
      console.log(e);
      throw new HttpException(
        {
          message: `user with this role : ${dto.role} submit failed`,
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async login(res: Response, dto: LoginDto) {
    try {
      const newLogin = {
        user_name: dto.user_name,
        email: dto.email,
        password: await hash(dto.password, 12),
        role_id: dto.role_id,
      };

      //*Login Logs
      const inputParam = {
        execution: 'login_log',
        user_id: 5, //!---> ?,
        request: {
          item: [newLogin],
        },
      };
      //*Login Logs

      //*Check Exist In Db and find it

      //> این دو مقدار باید به عتوان اینپوت پارمز به پراستیژر ارسال شن.
      const existUser = {
        by_username: find(core_users, { user_name: dto.user_name }),
        by_email: find(core_users, { email: dto.email }),
      };

      if (!existUser.by_email && !existUser.by_username) {
        return {
          message: `user with this data not register`,
          statusCode: HttpStatus.NOT_FOUND,
        };
      }
      //*Check Exist In Db and find it

      console.log(existUser);

      //* Check password

      const checkPassword_byUsername = await compare(
        dto.password,
        existUser?.by_username?.password || '',
      );
      const checkPassword_byEmail = await compare(
        dto.password,
        existUser?.by_email?.password || '',
      );

      if (!checkPassword_byUsername && !checkPassword_byEmail) {
        return {
          message: 'password or email is not valid pls try again',
          statusCode: HttpStatus.NOT_FOUND,
        };
      }

      //* Check password

      //* Create Token
      const payload = {
        sub: '---', //! IDK
        email: dto.email,
        role_id: dto.role_id,
      };

      const JsonWebToken = this.jwtService.sign(payload, {
        secret: this.envConfig.get('JWT_SECRET'),
        expiresIn: '7d', // انقضای ۷ روزه
      });

      res.cookie(dto.role, JsonWebToken, {
        httpOnly: true,
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 روز
        sameSite: 'lax', // یا 'strict' یا 'none' (برای کراس‌دومین)
        secure: false, // روی HTTPS true باشه
      });

      //* Create Token

      return {
        fakeData: dto,
        message: `login was successful for ${dto.email}`,
        statusCode: HttpStatus.OK,
      };
    } catch (e) {
      console.log(e);
      throw new HttpException(
        {
          message: `something is wrong in auth/login`,
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
