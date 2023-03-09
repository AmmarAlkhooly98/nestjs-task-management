import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { API_BASE_PATH } from './constants';
import { WinstonLogger } from './utils/logger';
import { TransformInterceptor } from './transform.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: WinstonLogger,
  });
  app.setGlobalPrefix(API_BASE_PATH);
  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  app.useGlobalInterceptors(new TransformInterceptor());

  const config = new DocumentBuilder()
    .addBearerAuth()
    .setTitle('Task Management API docs')
    .setDescription('API for task management applications')
    .setVersion('1.0')
    .addTag('Auth')
    .addTag('Tasks')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup(`${API_BASE_PATH}/docs`, app, document);

  await app.listen(3000);
}
bootstrap();
