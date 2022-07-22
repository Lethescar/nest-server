import { JwtStrategy } from './jwt.strategy';
import { jwtConstants } from './jwt.constant';
import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserService } from 'src/modules/user/user.service';
import { JwtModule } from '@nestjs/jwt';

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
export class AuthModule {}
