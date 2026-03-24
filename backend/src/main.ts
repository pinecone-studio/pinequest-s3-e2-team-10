import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { HttpExceptionLoggingFilter } from './common/http-exception.filter';
import { requestLogger } from './common/request-logger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  app.enableCors();
  app.use(requestLogger);
  app.useGlobalFilters(new HttpExceptionLoggingFilter());

  await app.listen(process.env.PORT ?? 3001);
}
void bootstrap();
