import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { Log4jsLogger } from '@nestx-log4js/core';

const listenPort = 3000;
const logger = new Logger('main.ts');

/**
 * @description 主方法
 * @date 19/07/2022
 */
async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  /**
   * 配置swagger
   */
  const config = new DocumentBuilder()
    .setTitle('nest后台服务Api')
    .setDescription('这里是描述XXXXX')
    .setVersion('1.0')
    .addBearerAuth(
      { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
      'jwt',
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('swagger-ui', app, document);

  /**
   * 使用log4js 日志框架
   */
  app.useLogger(app.get(Log4jsLogger));
  await app.listen(listenPort);
}
bootstrap().then(() => {
  logger.log(
    `default: http://localhost:${listenPort}/   swagger-ui: http://localhost:${listenPort}/swagger-ui/#/`,
  );
});
