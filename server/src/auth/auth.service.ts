import { Injectable, Logger } from '@nestjs/common';
import { IResponse } from 'src/interface/response.interface';
import { User } from 'src/interface/user.interface';
import { UserService } from 'src/modules/user/user.service';
import * as bcrypt from 'bcrypt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { JwtService } from '@nestjs/jwt';
import { ifEmpty } from 'src/utils/empty';

const logger = new Logger('auth.service.ts');
const svgCaptcha = require('svg-captcha');

@Injectable()
export class AuthService {
  private response: IResponse;
  private pointer: number = 0;
  private captcha = {};
  constructor(
    /**
     * 引入model,即db.module.ts中定义的'USER_MODEL' 设置为私有只读 User类型的Model
     */
    @InjectModel('USER_MODEL') private readonly userModule: Model<User>,
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  /**
   * @description 用户注册方法
   * @param user  满足User类型结构
   */
  public async register(user: User) {
    return this.userService
      .findOneByPhone(user.phone)
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
   * @description 用户密码修改方法
   * @param {User} user
   * @return {*}
   */
  public async alter(user: User) {
    return this.userService.findOneByPhone(user.phone).then(async () => {
      return await this.userModule
        .updateOne({ phone: user.phone }, { $set: user })
        .then(() => {
          return (this.response = {
            code: 0,
            msg: '用户修改成功',
          });
        });
    });
  }

  /**
   * @description 用户登录验证
   * @param {User} user
   */
  private async validateUser(user: User) {
    const { phone, password, username } = user;
    return await this.userService
      .findOneByPhone(phone)
      .then((res) => {
        if (res.length === 0) {
          this.response = {
            code: 3,
            msg: '用户尚未注册',
          };
          throw this.response;
        }
        return res[0];
      })
      .then((user: User) => {
        const isPasswordValid = bcrypt.compareSync(password, user.password);
        if (isPasswordValid) {
          return (this.response = {
            code: 0,
            msg: { id: user._id },
          });
        } else {
          this.response = {
            code: 4,
            msg: '用户密码错误',
          };
          throw this.response;
        }
      })
      .catch((err) => {
        return err;
      });
  }

  /**
   * @description 用户登录方法
   * @param {User} user
   */
  public async login(user: User) {
    return await this.validateUser(user)
      .then(async (res: IResponse) => {
        if (res.code !== 0) {
          this.response = res;
          throw this.response;
        }
        const userId = res.msg.id;
        this.response = {
          code: 0,
          data: { token: await this.createToken(user), userId },
          msg: '登录成功',
        };
        console.log(this.response);
        return this.response;
      })
      .catch((err) => {
        return err;
      });
  }

  /**
   * @description 创建token
   * @private
   * @param {User} user
   * @return {*}
   */
  private async createToken(user: User) {
    return await this.jwtService.sign(user);
  }

  /**
   * @description 生成验证码
   * @param {string} [id]
   * @return {*}
   */
  public async createCaptcha(id?: string) {
    if (!ifEmpty(id)) {
      delete this.captcha[id];
    }
    const c = svgCaptcha.create();
    this.captcha[this.pointer] = c.text;
    this.response = {
      code: 0,
      data: {
        id: this.pointer++,
        img: c.data,
      },
      msg: '',
    };
    return this.response;
  }

  /**
   * @description 验证码验证
   */
  public async validateCode(code: string, id: string) {
    this.response =
      this.captcha[id].toLocaleLowerCase() === code.toLocaleLowerCase()
        ? { code: 0, msg: '验证码正确' }
        : { code: 5, msg: '验证码错误' };
    return this.response;
  }
}
