import { User } from 'src/interface/user.interface';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class UserService {
  constructor(
    @InjectModel('USER_MODEL') private readonly userModule: Model<User>,
  ) {}
  /**
   * @description 注册方法
   * @param user
   * @returns
   */
  public async register(user: User) {
    return this.userModule
      .find({
        phone: user.telephone,
      })
      .then((res) => {
        if (res.length !== 0) {
          console.log('该用户已经注册');
          throw Error('用户已注册');
        }
      })
      .then(() => {
        try {
          const createUser = new this.userModule(user);
          return createUser.save();
        } catch (error) {
          throw Error('用户保存失败' + error);
        }
      })
      .catch((err) => {
        console.warn('发生问题' + err);
      });
  }
}
