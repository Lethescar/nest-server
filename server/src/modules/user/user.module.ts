import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { EncryptMiddleware } from 'src/middleware/encrypt.middleware';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from 'src/guard/auth.guard';

/**
 * 守卫
 */
const guardModule = {
  provide: APP_GUARD,
  useClass: AuthGuard,
};
@Module({
  providers: [UserService, guardModule],
  controllers: [UserController],
})
export class UserModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(EncryptMiddleware).forRoutes('user/register'); // 标明只在用户注册时生效
  }
}
