import { Inject, Injectable } from '@nestjs/common';
import { CACHE_MANAGER, Cache } from '@nestjs/cache-manager';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class RedisCacheService {
  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private configService: ConfigService
  ) {}

  get ttl() {
    return this.configService.get<number>('ttl');
  }

  async get<T>(key: string): Promise<T> {
    return this.cacheManager.get(key);
  }

  async set(key: string, value: any, ttl?: number): Promise<void> {
    return this.cacheManager.set(key, value, ttl ?? this.ttl);
  }

  async del(key: string): Promise<void> {
    return this.cacheManager.del(key);
  }
}

