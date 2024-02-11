import { Inject, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DataSourceToken } from '../constants/token.constants';
import { DataSource } from '../interfaces/data-source.interface';
import { RedisCacheService } from '../../cache-service/redis-cache.service';
import { TopRatedRepoQueryDto } from '../top-repos.dto';
import { TopRepos } from '../interfaces/top-repos.interface';
import { UtilsService } from  '../../utils/utils.service';

@Injectable()
export class DataSourceService {
  private logger = new Logger(DataSourceService.name);

  constructor(
    @Inject(DataSourceToken) private readonly dataSource: DataSource,
    private readonly redisCacheService: RedisCacheService,
    private readonly utilsService: UtilsService,
    private readonly configSrv: ConfigService,
  ) {}

  get defaultLimit() {
    return this.configSrv.get<number>('default_limit')
  }

  /**
    * Fetch top rated repositories form cache/data source.
    * @param queryParams TopRatedRepoQueryDto.
    * @returns TopRepos or an error.
  */
  public async fetchRepoFromDataSource(queryParams: TopRatedRepoQueryDto): Promise<TopRepos> {
    const key = this.generateCacheKey(queryParams);
    try {
      const cachedData = await this.redisCacheService.get<TopRepos>(key);
      if (cachedData && Object.keys(cachedData).length > 0) {
        console.log(" inside >>>>>>>>> ")
        // Retrieve from cache and slice
        const cachedReposData = this.utilsService.sliceRepoByLimit(cachedData, queryParams.language, queryParams.limit ?? this.defaultLimit);
        return this.utilsService.parseReposData(cachedReposData);
      }
  
      // Fetch from data source
      const reposForLanguage = await this.dataSource.fetchTopRatedRepo(
        queryParams.date,
        queryParams.language,
        queryParams.limit
      );
      // Cache retrieved data
      await this.redisCacheService.set(key, reposForLanguage);
      const reposData = this.utilsService.sliceRepoByLimit(reposForLanguage, queryParams.language, queryParams.limit ?? this.defaultLimit);
      return this.utilsService.parseReposData(reposData);
    } catch (error) {
      this.logger.error(`Error while fetching data from the data source, ${error}`)
      throw error;
    }
  }
  
  // Helper function for cache key generation
  private generateCacheKey(queryParams: TopRatedRepoQueryDto): string {
    return `${queryParams.date}-${queryParams.language}`;
  }
}