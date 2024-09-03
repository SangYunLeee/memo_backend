import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: '*', // 클라이언트 주소
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE', // 모든 HTTP 메소드를 허용
    allowedHeaders: 'Content-Type, Authorization',
    credentials: true,
  });
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      transformOptions: { enableImplicitConversion: true },
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );
  await app.listen(process.env.SERVER_PORT || 3001);
  console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();
