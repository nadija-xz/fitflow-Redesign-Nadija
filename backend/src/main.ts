import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Allow requests from Expo / React Native
  app.enableCors();

  const port = 3000;

  // Allow access from your phone on the same network
  await app.listen(port, '0.0.0.0');

  console.log('');
  console.log('===================================');
  console.log('FitFlow Backend Running');
  console.log(`http://localhost:${port}`);
  console.log('===================================');
}

bootstrap();
