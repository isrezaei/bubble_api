import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from "@nestjs/common";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);


  app.enableCors({
    origin: "http://localhost:3001" ,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });


  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, //!Allow to show null property in response object :)
      transform: true,
    }),
  );


  await app.listen(8080 , () => {
    console.log(`Application is running on: http://0.0.0.0:${8080}`);
  });
}
bootstrap();
