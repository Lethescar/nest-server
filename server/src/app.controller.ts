import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @ApiTags('getHello')
  @ApiOperation({
    summary: '测试接口',
  })
  getHello(): string {
    return this.appService.getHello();
  }
}
