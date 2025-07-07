import { Global, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from '../src/prisma/prisma.service';

type props = {
  inputParam: {
    execution: string;
    user_id?: number | null;
    request?: object | null;
  };
};

type response = {
  Status: string;
  code: number;
  item: any;
};

@Global()
@Injectable()
export class QuerySchemaService {
  constructor(private readonly prisma: PrismaService) {}

  async queryRaw({
    inputParam,
  }: props): Promise<{ result: response } | undefined> {
    try {
      const result = JSON.parse(
        (
          await this.prisma.$queryRaw`
          DECLARE @outputparam NVARCHAR(MAX);
          EXEC dbo.api_interface @inputparam = ${inputParam},      
          @outputparam = @outputparam OUTPUT;            
          SELECT @outputparam AS outputparam`
        )[0].outputparam,
      );

      return {
        result,
      };
    } catch (e) {
      console.log(e);
      throw new HttpException(
        {
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
