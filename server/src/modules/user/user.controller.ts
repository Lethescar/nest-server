import { UserService } from './user.service';
import { Body, Controller, Post } from '@nestjs/common';
import { User } from 'src/interface/user.interface';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@Controller('user')
@ApiTags('用户模块')
export class UserController {
  constructor(private userService: UserService) {}

  @Post('register')
  @ApiOperation({
    summary: '用户注册',
  })
  async registerUser(@Body() userDto: User) {
    return await this.userService.register(userDto);
  }
}
