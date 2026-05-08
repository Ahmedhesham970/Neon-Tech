import { Controller, Get, Post, Req } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
  @Post('hello')
  postHello(): string {
    return this.appService.getHelloPost();
  }
  @Get('hi')
  getHi(@Req() request: Request): string {
    return request.method + ' ' + request.url;
  }
  @Get('hello')
  getWow(): string {
    return this.appService.getWow();
  }
}
