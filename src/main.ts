import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { API_BASE_PATH } from './constants';
import { WinstonLogger } from './utils/logger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: WinstonLogger,
  });

  app.setGlobalPrefix(API_BASE_PATH);

  const config = new DocumentBuilder()
    .setTitle('Vaccination API docs')
    .setDescription('The vaccination API description')
    .setVersion('1.0')
    .addTag('persons')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup(`${API_BASE_PATH}/docs`, app, document);

  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  await app.listen(3000);
}
bootstrap();
