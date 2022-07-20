import { User } from 'src/interface/user.interface';
import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IResponse } from 'src/interface/response.interface';

const logger = new Logger('user.service.ts');
@Injectable()
export class UserService {
  private response: IResponse;
  constructor(
    /**
     * 引入model,即db.module.ts中定义的'USER_MODEL' 设置为私有只读 User类型的Model
     */
    @InjectModel('USER_MODEL') private readonly userModule: Model<User>,
  ) {}
  /**
   * @description 注册方法
   * @param user  满足User类型结构
   * @returns
   */
  public async register(user: User) {
    return this.findOneByPhone(user.phone)
      .then((res) => {
        if (res.length !== 0) {
          this.response = {
            code: 1,
            msg: '当前手机号已注册',
          };
          throw this.response;
        }
      })
      .then(async () => {
        try {
          const createUser = new this.userModule(user);
          await createUser.save();
          this.response = {
            code: 0,
            msg: '注册成功',
          };
          return this.response;
        } catch (error) {
          this.response = {
            code: 2,
            msg: '用户注册失败,请联系管理员,错误详情: ' + error,
          };
          throw this.response;
        }
      })
      .catch((err) => {
        logger.log(`${user.phone}:${err.msg}`);
        return this.response;
      });
  }

  /**
   * @description 通过手机号查找用户
   * @date 20/07/2022
   * @private
   * @param {string} phone
   * @return {*}
   * @memberof UserService
   */
  private async findOneByPhone(phone: string) {
    return await this.userModule.find({
      phone,
    });
  }
}
