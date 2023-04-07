import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { useContainer } from 'class-validator';
import * as basicAuth from 'express-basic-auth';
import 'reflect-metadata';
import { getAPIDetails } from 'src/util';
import { APIDetails } from './common/api-details';
import { AppModule } from './modules/app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
      transformOptions: { enableImplicitConversion: true },
    })
  );

  useContainer(app.select(AppModule), { fallbackOnErrors: true });

  app.use(
    ['/api', '/api-json'],
    basicAuth({
      challenge: true,
      users: {
        ['changeme']: 'changeme',
      },
    })
  );

  const apiDetails: APIDetails = await getAPIDetails();

  const config = new DocumentBuilder()
    .setTitle(apiDetails.name)
    .setDescription(apiDetails.description)
    .setVersion(apiDetails.version)
    .build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('doc', app, document, {
    swaggerOptions: { tagsSorter: 'alpha', operationsSorter: 'alpha' },
  });

  await app.listen(7000);
}
bootstrap();
