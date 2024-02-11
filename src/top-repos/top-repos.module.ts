import { Module, Scope } from '@nestjs/common';
import { DataSourceFactory } from './data-source.factory';
import { TopReposController } from './top-repos.controller';
import { GithubAPIService } from './services/github.servie';
import { DataSourceToken } from './constants/token.constants';
import { DataSourceService } from './services/data-source.service';
import { CSVParserService } from './services/csv-parser.service';
import { HttpRequestModule } from '../http-service/http-service.module';
import { CacheServiceModule } from '../cache-service/redis-cache.module';
import { UtilsModule } from '../utils/utils.module';

@Module({
  imports: [
    HttpRequestModule,
    CacheServiceModule,
    UtilsModule,
  ],
  controllers: [ TopReposController ],
  providers: [
    {
      provide: DataSourceToken,
      scope: Scope.REQUEST,
      useFactory: (dataSourceFactory: DataSourceFactory) => {
        return dataSourceFactory.create();
      },
      inject: [DataSourceFactory],
    },
    DataSourceFactory,
    DataSourceService,
    GithubAPIService,
    CSVParserService
  ],
  exports: [DataSourceToken],
})
export class TopRatedRepositoryModule {}
