import { Injectable, Logger, UnsupportedMediaTypeException } from '@nestjs/common';
import { DataSource } from '../interfaces/data-source.interface';
import { HttpRequestService } from '../../http-service/http-service.service';
import { ConfigService } from '@nestjs/config';
import { CSVParserService } from './csv-parser.service';
import { UNSUPPORTED_MEDIA_TYPE } from '../constants/error-message.constant';
import { TopRepos } from '../interfaces/top-repos.interface';
import { UtilsService } from '../../utils/utils.service';
import { ProgrammingLanguage } from '../types/programming-language';

@Injectable()
export class GithubAPIService implements DataSource {
  private logger = new Logger(GithubAPIService.name);
    constructor(
      private readonly httpService: HttpRequestService,
      private readonly configSrv: ConfigService,
      private readonly CSVParserService: CSVParserService,
      private readonly utilsService: UtilsService
  ) {}

  get externalUrl () {
    return this.configSrv.get<string>('external_url')
  }

  /**
    * Fetch top rated repositories form github.
    * @param date top rated repos of the date.
    * @param language language of the repo.
    * @param limit number of repos to be fetched.
    * @returns An Observable of the response data or an error.
  */
  public async fetchTopRatedRepo(date: string, language: ProgrammingLanguage): Promise<TopRepos> {
    try {
      const url = `${this.externalUrl}${date}.csv`;
      // Make the HTTP request with validation:
      const response = await this.httpService.get<string>(url, { responseType: 'text' });
      
      // Validate response content type:
      if (response.headers['content-type'] !== 'text/plain; charset=utf-8') {
        throw new UnsupportedMediaTypeException(`${UNSUPPORTED_MEDIA_TYPE}: ${response.headers['content-type']}`);
      }
      
      // Parse CSV, group by language, and slice:
      const data = await this.CSVParserService.parseCsv(response.data);
      const groupedData = this.utilsService.groupByLanguage(data);
      const repoForLanguage = { [language]: groupedData[language] };
      return repoForLanguage;  

    } catch (error) {
      this.logger.error(`Error in fetching data from github service, ${error}`)
      throw error;
    }
  }
}

