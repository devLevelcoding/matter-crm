import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  const port = process.env.PORT ?? 3322;
  await app.listen(port);
  console.log(`matter-crm listening on :${port}`);
}
bootstrap();
