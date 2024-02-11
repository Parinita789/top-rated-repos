import { IsString, IsEnum, IsInt, Min, Max, IsOptional } from 'class-validator';
import { ProgrammingLanguage } from './types/programming-language';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class TopRatedRepoQueryDto {
  @ApiProperty({
    example: '2019-02-22',
    description: 'Top repositories of the date'
  })
  @IsString()
  date?: string;

  @ApiProperty({
    example: 'JavaScript',
    description: 'Programming language of the top repositories'
  })
  @IsEnum(ProgrammingLanguage)
  language: ProgrammingLanguage;

  @ApiProperty({
    example: 10,
    description: 'Number of the repos to be fetched'
  })
  @IsInt()
  @Type(() => Number)
  @Min(1)
  @Max(100)
  @IsOptional()
  limit?: number
}