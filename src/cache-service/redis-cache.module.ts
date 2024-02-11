import { Module } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';
import * as redisStore from 'cache-manager-redis-store';
import { RedisCacheService } from './redis-cache.service';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [
    CacheModule.register({
      useFactory: (configService: ConfigService) => ({
        store: redisStore,
        host: configService.get('redis.host'),
        port: configService.get('redis.port'),
        logger: console,
        debug: true
      })
    })
  ],
  providers: [
    RedisCacheService
  ],
  exports: [RedisCacheService]
})
export class CacheServiceModule {}