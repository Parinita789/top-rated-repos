import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { ConfigModule } from '@nestjs/config';
import configuration from '../src/config/configuration';

describe('TopRepos Controller (E2E)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          load: [configuration]
        }),
        AppModule
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  describe('GET /top-rated/repo', () => {
    it('should return top repos for valid parameters', async () => {
      const response = await request(app.getHttpServer())
        .get('/top-rated/repo')
        .query({ date: '2019-02-22', language: 'JavaScript', limit: 2 });

      expect(response.status).toBe(200);
    });

    it('should handle missing date parameter', async () => {
      const response = await request(app.getHttpServer())
        .get('/top-rated/repo')
        .query({ language: 'JavaScript', limit: 2 });
            expect(response.status).toBe(400);
      expect(response.body.message).toEqual(['date must be a string']);
    });

    it('should handle invalid date format', async () => {
      const response = await request(app.getHttpServer())
        .get('/top-rated/repo')
        .query({ date: 'invalid date', language: 'JavaScript', limit: 2 });

      expect(response.status).toBe(400);
      expect(response.body.message).toBe('Invalid date. Please enter a valid date in YYYY-MM-DD format.');
    });

    it('should handle missing language parameter', async () => {
      const response = await request(app.getHttpServer())
        .get('/top-rated/repo')
        .query({ date: '2019-02-22', limit: 2 });

      expect(response.status).toBe(400);
      expect(response.body.message).toEqual(["language must be one of the following values: JavaScript, TypeScript, Python, C++, Shell, Dart, C, Java, Markdown, Go, Rust, Vue, CSS, CSharp, PHP, Clojure, R, HTML, Groovy, Jupyter Notebook, Rich Text Format, Scala, SCSS, Ruby, ApacheConf, ActionScript, CoffeeScript, DM, Elixir, Haskell, Julia, Kotlin, Lua, MATLAB, Objective-C, Perl, PowerShell, Swift, TeX, Vim script"]);
    });

    it('should handle invalid language value', async () => {
      const response = await request(app.getHttpServer())
        .get('/top-rated/repo')
        .query({ date: '2019-02-22', language: 'invalid', limit: 2 });

      expect(response.status).toBe(400);
      expect(response.body.message).toEqual(["language must be one of the following values: JavaScript, TypeScript, Python, C++, Shell, Dart, C, Java, Markdown, Go, Rust, Vue, CSS, CSharp, PHP, Clojure, R, HTML, Groovy, Jupyter Notebook, Rich Text Format, Scala, SCSS, Ruby, ApacheConf, ActionScript, CoffeeScript, DM, Elixir, Haskell, Julia, Kotlin, Lua, MATLAB, Objective-C, Perl, PowerShell, Swift, TeX, Vim script"]);
    });

    it('should handle invalid limit value', async () => {
      const response = await request(app.getHttpServer())
        .get('/top-rated/repo')
        .query({ date: '2019-02-22', language: 'JavaScript', limit: 'invalid' });

      expect(response.status).toBe(400);
      expect(response.body.message).toEqual([
        "limit must not be greater than 100",
        "limit must not be less than 1",
        "limit must be an integer number"
      ]);
      // expect(response.body.message).toBe("'limit must not be greater than 100', 'limit must not be less than 1', 'limit must be an integer number'");
    });
  });
});