import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import { LoggerMiddleware } from './common/Middleware/logger.middleware';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const port = Number(process.env.SERVER_PORT);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));
  app.use(new LoggerMiddleware().use)
  await app.listen(port);
  console.log(`Server is running on http://localhost:${port}`);
}
bootstrap();
