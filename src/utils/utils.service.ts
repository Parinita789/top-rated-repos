import { Injectable, Logger } from '@nestjs/common';
import { TopRepos } from '../top-repos/interfaces/top-repos.interface';
import { ProgrammingLanguage } from '../top-repos/types/programming-language';

@Injectable()
export class UtilsService {
  private logger = new Logger(UtilsService.name);
  
  groupByLanguage(repoDatas: RepoData[]): Record<string, RepoData[]> {
    const groupedRepos: Record<string, RepoData[]> = {};  
    for (const repoData of repoDatas) {
      const language = repoData.language;
  
      if (!language) {
        this.logger.warn(`Skipping repo '${repoData.repo_name}' due to missing language`);
        continue;
      }
      if (!groupedRepos[language]) {
        groupedRepos[language] = [];
      }
      groupedRepos[language].push(repoData);
    }
    return groupedRepos;
  }

  sliceRepoByLimit(data: { [language: string]: any[] }, language: ProgrammingLanguage, limit: number): TopRepos {
    let slicedData = data[language].slice(0, limit);
    return {[language]: slicedData }
  }

  parseReposData(data) {
    if (typeof data !== 'object' || !Array.isArray(data[Object.keys(data)[0]])) {
      throw new Error('Invalid data format. Expected an object with language key mapping to an array of repos.');
    }
  
    const parsedData = {};
    for (const [language, repos] of Object.entries(data)) {
      if (!Array.isArray(repos)) {
        throw new Error(`Invalid data format for language: ${language}. Expected an array of repos.`);
      }
      parsedData[language] = repos.map(repo => ({
        rank: parseInt(repo.rank),
        name: repo.repo_name,
        stars: parseInt(repo.stars, 10),
        forks: parseInt(repo.forks, 10),
        language: repo.language,
        url: repo.repo_url,
        username: repo.username,
        issues: parseInt(repo.issues, 10),
        lastCommit: new Date(repo.last_commit),
        description: repo.description,
      }));
    }
  
    return parsedData;
  }

}