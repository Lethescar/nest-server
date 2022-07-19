import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DbModule } from './db/db.module';
import { UserModule } from './modules/user/user.module';
import { Log4jsModule } from '@nestx-log4js/core';

@Module({
  imports: [DbModule, UserModule, Log4jsModule.forRoot()],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
