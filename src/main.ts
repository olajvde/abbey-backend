import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';
import helmet from 'helmet';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  dotenv.config();
  //* ENABLE CORS
  app.enableCors({
    origin: '*', // You can configure this to allow specific origins
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // You can configure this to allow specific HTTP methods
    allowedHeaders: ['Content-Type', 'Authorization'], // You can configure this to allow specific headers
  });

  app.use(helmet());
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
