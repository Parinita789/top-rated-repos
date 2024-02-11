import { ApiProperty } from '@nestjs/swagger';
import { TopRepos } from '../interfaces/top-repos.interface';

export class TopReposResponse {
  @ApiProperty({
    example: {
        'PHP': [
            {
                'rank': 33,
                'item': 'top-100-stars',
                'repo_name': 'laravel',
                'stars': 50056,
                'forks': 15348,
                'language': 'PHP',
                'repo_url': 'https://github.com/laravel/laravel',
                'username': 'laravel',
                'issues': 27,
                'last_commit': '2019-02-20T02:58:44Z',
                'description': 'A PHP framework for web artisans'
            },
            {
                'rank': 48,
                'item': 'top-100-forks',
                'repo_name': 'laravel',
                'stars': 50056,
                'forks': 15348,
                'language': 'PHP',
                'repo_url': 'https://github.com/laravel/laravel',
                'username': 'laravel',
                'issues': 27,
                'last_commit': '2019-02-20T02:58:44Z',
                'description': 'A PHP framework for web artisans'
            }
        ]
    },
    description: 'Top repos for a language for a particular date with limits'
  })
  data: TopRepos
}