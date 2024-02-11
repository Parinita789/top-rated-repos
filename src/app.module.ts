import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { TopRatedRepositoryModule } from './top-repos/top-repos.module';
import { UtilsModule } from './utils/utils.module';
import configuration from './config/configuration';

@Module({
  imports: [
    ConfigModule.forRoot({ load: [configuration], isGlobal: true }),
    TopRatedRepositoryModule,
    UtilsModule
  ],
  controllers: [AppController],
})
export class AppModule {}
