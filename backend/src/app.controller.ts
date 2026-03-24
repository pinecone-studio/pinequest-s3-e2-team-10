import { Controller, Get } from '@nestjs/common';
import { executeOrRethrow } from './common/error-handling';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getOverview() {
    return executeOrRethrow(
      () => this.appService.getOverview(),
      'Failed to handle GET /',
    );
  }

  @Get('health')
  getHealth() {
    return executeOrRethrow(
      () => this.appService.getHealth(),
      'Failed to handle GET /health',
    );
  }
}
