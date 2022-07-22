import { AuthService } from './auth.service';
import { Body, Controller, Post } from '@nestjs/common';
import { User } from 'src/interface/user.interface';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@Controller('auth')
@ApiTags('用户验证模块')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiOperation({
    summary: '用户注册',
  })
  async registerUser(@Body() userDto: User) {
    return await this.authService.register(userDto);
  }

  @Post('login')
  @ApiOperation({
    summary: '用户登录',
  })
  public async userLogin(@Body() userDto: User) {
    return await this.authService.login(userDto);
  }
}
