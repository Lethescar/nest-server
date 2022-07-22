import { User } from 'src/interface/user.interface';
import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IResponse } from 'src/interface/response.interface';

@Injectable()
export class UserService {
  constructor(
    /**
     * 引入model,即db.module.ts中定义的'USER_MODEL' 设置为私有只读 User类型的Model
     */
    @InjectModel('USER_MODEL') private readonly userModule: Model<User>,
  ) {}

  /**
   * @description 通过手机号查找用户
   * @param {string} phone
   * @memberof UserService
   */
  public async findOneByPhone(phone: string) {
    return await this.userModule.find({
      phone,
    });
  }
}
