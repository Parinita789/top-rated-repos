import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import * as compression from 'compression';
import { AppModule } from './app.module';
import * as bodyParser from 'body-parser';
import { TopRatedRepositoryModule } from './top-repos/top-repos.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(compression());
  /** Set global prefix for the API */
  app.setGlobalPrefix('/api');

  /** Setup the Open API config */
  const config = new DocumentBuilder()
    .setTitle('top-rated-repositories')
    .setDescription('The Top rated Repositories')
    .setVersion('3.0')
    .build()

  const document = SwaggerModule.createDocument(app, config, {
    include: [
      TopRatedRepositoryModule
    ]
  })

  SwaggerModule.setup('api', app, document);

  await app.listen(configService.get('port') || 3000);
}
bootstrap();
