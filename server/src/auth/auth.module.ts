import { JwtStrategy } from './jwt.strategy';
import { jwtConstants } from './jwt.constant';
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserService } from 'src/modules/user/user.service';
import { JwtModule } from '@nestjs/jwt';
import { EncryptMiddleware } from 'src/middleware/encrypt.middleware';

@Module({
  imports: [
    // 引入jwt模块
    JwtModule.register({
      secret: jwtConstants.secret,
    }),
  ],
  providers: [AuthService, UserService, JwtStrategy], // 提供jwt策略
  controllers: [AuthController],
})
export class AuthModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(EncryptMiddleware).forRoutes('auth/register', 'auth/alter'); // 标明只在用户注册时生效
  }
}
