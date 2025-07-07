import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Post,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { map } from 'lodash';
import { Prisma } from '@prisma/client';

@Controller()
export class ShokrgozariController {
  constructor(private readonly prisma: PrismaService) {}

  @Get('/read/shokrgozari')
  async readShokrgozari() {
    try {
      const inputParam = {
        execution: 'retrieve_shokrgozari',
        user_id: 0,
        request: {},
      };

      const result = await this.prisma.$queryRaw`
       DECLARE @outputparam1 NVARCHAR(MAX);
       EXEC dbo.api_interface 
       @inputparam = ${Prisma.sql`${inputParam}`}, 
       @outputparam = @outputparam1 OUTPUT`;

      const outputParamResult = result[0]?.outputparam;

      console.log(outputParamResult);

      return {
        result: JSON.parse(outputParamResult),
      };
    } catch (e) {
      console.log(e);

      throw new HttpException(
        {
          message: 'Error in read shokrgozari',
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post('/create/shokrgozari')
  async createShokreGozari(@Body() dto) {
    try {
      const dtoCore = {
        execution: 'add_shokrgozari',
        user_id: 0,
        request: {
          item: map(dto.request.item, 'title'),
        },
      };

      const result = await this.prisma.$queryRaw`
        DECLARE @outputparam NVARCHAR(MAX);
        EXEC dbo.api_interface @inputparam = ${dtoCore},
        @outputparam = @outputparam OUTPUT;
        SELECT @outputparam AS outputParamResult;
      `;

      const outputParamResult = result[0]?.outputParamResult;

      console.log(outputParamResult);

      return {
        result: JSON.parse(outputParamResult),

        // result: 'yep!',
      };
    } catch (e) {
      console.log(e);

      return new HttpException({}, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
