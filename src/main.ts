import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { useContainer } from 'class-validator';
import { Logger, LoggerErrorInterceptor } from 'nestjs-pino';
import { CONSTANTS } from '@/constants';
import { ValidationPipe, VersioningType } from '@nestjs/common';

async function bootstrap() {
  /**
   * Nest initialization and configuration
   */
  const app = await NestFactory.create(AppModule, {
    cors: true,
    bufferLogs: true,
    logger: ['error', 'warn', 'log', 'debug'],
  });
  useContainer(app.select(AppModule), { fallbackOnErrors: true });
  app.useLogger(app.get(Logger));
  app.useGlobalInterceptors(new LoggerErrorInterceptor());
  app.enableShutdownHooks();
  app.setGlobalPrefix(CONSTANTS.API.PREFIX, {
    exclude: ['/'],
  });
  app.enableVersioning({
    defaultVersion: CONSTANTS.API.DEFAULT_VERSION,
    type: VersioningType.URI,
  });
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
    }),
  );

  /**
   * Documentation API initialization and configuration
   */
  const options = new DocumentBuilder()
    .setTitle(CONSTANTS.SWAGGER.TITLE)
    .setDescription(CONSTANTS.SWAGGER.DESCRIPTION)
    .setVersion(CONSTANTS.SWAGGER.VERSION)
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup(CONSTANTS.SWAGGER.PATH, app, document);
  await app.listen(process.env.APP_PORT ?? 1080);
}
void bootstrap();
