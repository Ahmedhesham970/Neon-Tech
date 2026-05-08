import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }
  getHelloPost(): string {
    return 'Hello World from post request!';
  }
  getHi(): string {
    return '<h1>Hi there!</h1>';
  }
  getWow(): string {
    return 'wow wow wow This is soooo amazing!';
  }
}
