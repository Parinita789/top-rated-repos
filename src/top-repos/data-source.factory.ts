import { Injectable, Inject, Scope, BadRequestException, Logger } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
import { GithubAPIService } from './services/github.servie';
import { DataSource } from './types/data-source';
import { INVALID_DATA_SOURCE } from './constants/error-message.constant';

@Injectable({ scope: Scope.REQUEST })
export class DataSourceFactory {
  private logger = new Logger(DataSourceFactory.name);

  constructor(
    @Inject(REQUEST) private request: Request,
    private githubService: GithubAPIService,
  ) {}

  create() {
    const sourceParam = this.request?.query?.source || DataSource.GITHUB;
    switch (sourceParam) {
      case DataSource.GITHUB:
        return this.githubService;
      // case 'dataSource2':
      // return this.dataSource2Service;
      // case 'dataSource3':
      // return this.dataSource3Service;
      default:
        this.logger.error(`invalid data source ${sourceParam}`);
        throw new BadRequestException(INVALID_DATA_SOURCE)
    }
  }
}