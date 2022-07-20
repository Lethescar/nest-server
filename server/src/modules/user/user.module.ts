import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { EncryptMiddleware } from 'src/middleware/encrypt.middleware';

@Module({
  providers: [UserService],
  controllers: [UserController],
})
export class UserModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(EncryptMiddleware).forRoutes('user/register'); // 标明只在用户注册时生效
  }
}
