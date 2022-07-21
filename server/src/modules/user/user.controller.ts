import { UserService } from './user.service';
import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { User } from 'src/interface/user.interface';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/guard/auth.guard';
import { Role } from '../role/role.decorator';

@Controller('user')
@ApiTags('用户模块')
@UseGuards(AuthGuard)
export class UserController {
  constructor(private userService: UserService) {}

  @Post('register')
  @ApiOperation({
    summary: '用户注册',
  })
  async registerUser(@Body() userDto: User) {
    return await this.userService.register(userDto);
  }

  @Get('hello')
  @ApiOperation({
    summary: '测试守卫',
  })
  @Role('admin')
  async hello() {
    return 'hello world!';
  }
}
