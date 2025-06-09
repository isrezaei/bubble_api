import { Body, Controller, Get, Post } from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Controller()
export class ProcedureController {
  constructor(private readonly prisma: PrismaService) {}

  @Get('/all')
  async getAllData() {
    try {
      const result = await this.prisma.$queryRaw`
       EXEC dbo.GatData;
       `;

      console.log(result[0]);

      return { result };
    } catch (e) {}
  }

  @Post('/create/users')
  async createUsers(@Body() dto) {
    console.log('hello');

    try {
      const data = [
        { ID: 1001, NAME: 'taghi', AGE: 45 },
        { ID: 1002, NAME: 'naghi', AGE: 46 },
        { ID: 1003, NAME: 'akbar', AGE: 47 },
      ];

      // استفاده از Prisma.sql برای محافظت در برابر تزریق SQL
      const result = await this.prisma.$executeRaw`
      
      DECLARE @Persons PersonType;

      -- استفاده از Prisma.sql برای جلوگیری از تزریق SQL
      INSERT INTO @Persons (id, name, age)
      VALUES ${Prisma.sql`${Prisma.join(
        data.map((d) => Prisma.sql`(${d.ID}, ${d.NAME}, ${d.AGE})`),
        ', ',
      )}`};

      EXEC InsertPersons @Persons;
    `;

      //       const result = await this.prisma.$executeRaw`
      //   INSERT INTO Users (id, name, age)
      //   VALUES ${Prisma.raw(values)};
      // `;

      // const result = await this.prisma.bubble_Hello.createMany({
      //   data: [{ ID: 11, Name: 'w', Age: 20 }],
      // });

      console.log(result);

      return result;
    } catch (e) {
      console.log(e);
      return null;
    }
  }

  @Post('/create/user')
  async createOneUser() {
    try {
      // const result = await this.prisma.bubble_Hello.create({
      //   data: { ID: 120, Name: 'Nima', Age: 18 },
      // });

      // const result2 = await this.prisma.$queryRaw`
      // EXEC InsertUserAge @id = ${222}, @name = ${'violet'}, @age = ${19}`;
      //
      // console.log(result2);

      const result3 = await this.prisma.$queryRaw`
      
        EXEC Dev.dbo.create_user @param1 = ${'test hello world'}
        
        `;

      return {
        result3,
      };
    } catch (e) {
      console.log(e);
      return null;
    }
  }
}
