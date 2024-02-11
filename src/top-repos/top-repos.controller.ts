import { 
  Controller, 
  Get,
  InternalServerErrorException,
  Query,
  UsePipes,
  ValidationPipe, 
} from "@nestjs/common";
import { DataSourceService } from './services/data-source.service';
import { GetQueryPipe } from "./pipe-validation";
import { TopRatedRepoQueryDto } from "./top-repos.dto";
import { TopRepos } from "./interfaces/top-repos.interface";
import { UNEXPECTED_ERROR } from "./constants/error-message.constant";
import { ApiOperation, ApiResponse } from "@nestjs/swagger";
import { TopReposResponse } from "./types/top-repos-response";

@Controller('/top-rated/repo')
export class TopReposController {
constructor(
  private readonly dataSourceService: DataSourceService
) {}

@Get()
@ApiOperation({ summary: 'Get top rated repositories of specified date'})
@ApiResponse({
  status: 200,
  type: TopReposResponse
})
@UsePipes(new ValidationPipe({ transform: true }))
  async getTopRepos(@Query(new GetQueryPipe()) queryParams: TopRatedRepoQueryDto): Promise<TopRepos> {
    try {
      return this.dataSourceService.fetchRepoFromDataSource(queryParams);
    } catch (err) {
      throw new InternalServerErrorException(UNEXPECTED_ERROR);
    }
  }
}
