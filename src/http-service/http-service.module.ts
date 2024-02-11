import { Module } from '@nestjs/common';
import { HttpRequestService } from './http-service.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule],
  providers: [
    HttpRequestService
  ],
  exports: [HttpRequestService],
})
export class HttpRequestModule {}
