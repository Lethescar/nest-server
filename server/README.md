## server启动

```bash
$ yarn add .
$ npm run start -w
```



| 文件名            | 文件描述                                                     |
| ----------------- | ------------------------------------------------------------ |
| app.controller.ts | 常见功能是用来处理 http 请求以及调用 service 层的处理方法    |
| app.module.ts     | 根模块用于处理其他类的引用与共享                             |
| app.service.ts    | 封装通用的业务逻辑、与数据层的交互（例如数据库）、其他额外的一些三方请求 |
| main.ts           | 应用程序入口文件。它使用 NestFactory 用来创建 Nest 应用实例  |



## 步骤

### 1、搭建服务项目

+ 全局安装nestjs

```bash
# yarn 安装
$ yarn global add @nestjs/cli
# npm 安装
$ npm i -g @nestjs/cli
```

+ 创建nest项目

```bash
$ nest new project-name
```

### 2、nestjs配置swagger

+ 安装swagger

  ```bash
  $ yarn add @nestjs/swagger
  ```

+ 在main.ts文件中引入配置

  ```ts
  import { NestFactory } from '@nestjs/core';
  import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
  import { AppModule } from './app.module';
  
  const listenPort = 3000;
  const logger = new Logger('main.ts');
  
  /**
   * @description 主方法
   */
  async function bootstrap() {
    const app = await NestFactory.create(AppModule);
  
    /**
     * 配置swagger
     */
    const config = new DocumentBuilder()
      .setTitle('标题XXXXX')
      .setDescription('描述XXXXX')
      .setVersion('1.0')
      .build();
  
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('swagger-ui', app, document);
  
    await app.listen(listenPort);
  }
  bootstrap().then(() => {
    logger.log(
      `default: http://localhost:${listenPort}/   swagger-ui: http://localhost:${listenPort}/swagger-ui/#/`,
    );
  });
  ```

### 3、安装mongodb

+ 下载地址： https://www.mongodb.com/try/download/community

### 4、mongodb管理系统

+ git地址：https://github.com/mrvautin/adminMongo

+ 拷贝到本地

+ 安装依赖 启动

  ```bash
  $ yarn add .
  $ npm run start
  ```

+ 创建自己的数据库表
  
  Connection name：数据库名   例： db
  Connection string：数据库地址   例：mongodb:127.0.0.1:27017
  Connection options：参数    可不填
  
  点击Add connection 按钮  即添加成功

### 5、nest服务连接mongodb数据库

+ 安装依赖

```bash
$ yarn add @nestjs/mongoose mongoose
```

#### (1)把数据库相关封装成独立模块(此处以用户user为例说明)

+ 在src文件夹下生成db模块，可通过命令行实现；即会生成db.module.ts文件

```bash
$ nest g mo db
```

+ 在db.module.ts文件中引入配置

```ts
import { Global, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from './schema/user.schema';

const MONGO_MODELS = MongooseModule.forFeature([
  {
    name: 'USER_MODEL',
    schema: UserSchema,
    collection: 'user',
  },
]);

@Global()
@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost:27017/letheVideo'),
    MONGO_MODELS,
  ],
  exports: [MONGO_MODELS],
})
export class DbModule {}
```

+ 创建 **用户Schema** 对照表，标明 表下 拥有的内容

  + 在src下新建interface文件夹，并新建user.interface.ts文件

  ```ts
  import { Prop, Schema } from '@nestjs/mongoose';
  import { ApiProperty } from '@nestjs/swagger';
  import { Document } from 'mongoose';
  
  @Schema()
  export class User extends Document {
    @Prop()
    @ApiProperty({
      description: '用户手机号',
      example: '1780000000',
    })
    readonly phone: string;
  
    @Prop()
    @ApiProperty({
      description: '用户密码',
      example: '123456',
    })
    readonly password: string;
  }
  ```

+ 在db文件夹中创建schema文件夹，并新建 **user.schema.ts** 文件，**将 class 语法转换为 Mongoose schema 语法并导出**

```ts
import { User } from 'src/interface/user.interface';
import { SchemaFactory } from '@nestjs/mongoose';

export const UserSchema = SchemaFactory.createForClass(User);
```

+ 在db.module.ts文件中添加配置

```tsx
...
import { UserSchema } from './schema/user.schema';

const MONGO_MODELS = MongooseModule.forFeature([
  {
    name: 'USER_MODEL',
    schema: UserSchema,
    collection: 'user',
  },
]);

@Global()
@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost:27017/letheVideo'),
    MONGO_MODELS,
  ],
  exports: [MONGO_MODELS],
})
...
```

#### (2)编写接口(此处以用户user为例说明)

+ 新建modules文件夹
+ 在终端输入命令，即会生成user文件夹以及user.module.ts、user.service.ts、user.controller.ts文件

```bash
$ nest g mo user
$ nest g service user
$ nest g co user
```

+ 将user文件夹移动至modules文件夹中

+ 在user.service.ts文件中编写主要业务逻辑代码

```tsx
import { User } from 'src/interface/user.interface';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class UserService {
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
    return this.userModule
      .find({
        phone: user.phone,
      })
      .then((res) => {
        if (res.length === 0) {
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
```

+ 在user.cotroller.ts中处理 http 请求以及调用 service 层的处理方法

```tsx
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
```

### 6、配置Log4js日志打印(可不配置)

+ 安装依赖

```bash
$ yarn add @nestx-log4js/core
```

+ 在app.module.ts中导入模块

```tsx
import { Log4jsModule } from '@nestx-log4js/core';

@Module({
  imports: [DbModule, UserModule, Log4jsModule.forRoot()],
  controllers: [AppController],
  providers: [AppService],
})
```

+ 在main.ts中调用

```tsx
import { Log4jsLogger } from '@nestx-log4js/core';

app.useLogger(app.get(Log4jsLogger));
```

### 7、中间件使用

+ 新建middleware文件夹
+ 执行命令行，生成文件(加密中间件)，将其移动至middleware文件夹

```bash
$ nest g mi encrypt
```

+ 进入encrypt.middleware.ts文件，修改参数类型

```tsx
import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction } from 'express';

@Injectable()
export class EncryptMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    console.log(req.body);
    next();
  }
}
```

+ 在user.module.ts文件中配置，使UserModule实现NestModule，监听中间件

```
export class UserModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(EncryptMiddleware)
      .forRoutes('user'); // 标明只在用户模块下生效
  }
}
```

### 8、bcrypt加密

+ 安装依赖

```bash
$ yarn add bcrypt
$ yarn add -D @types/bcrypt
```

+ 新建或修改以下文件

  + src/interface/response.interface.ts(新建)

  ```tsx
  /**
   * @description  返回提交报文格式
   * @date 20/07/2022
   * @export
   * @interface IResponse
   */
  export interface IResponse {
    code: number; // 0 成功
    msg: any;
  }
  ```

  + src/interface/user.interface.ts(修改)

  ```tsx
  ...
  export class User extends Document {
    ...
    @Prop()
    readonly salt?: string;
  }
  ```

  + src/middleware/encrypt.middleware.ts(修改)

  ```tsx
  import { Injectable, NestMiddleware } from '@nestjs/common';
  import { NextFunction } from 'express';
  import { handleEncrypt, setSalt } from 'src/utils/encrypt';
  
  @Injectable()
  export class EncryptMiddleware implements NestMiddleware {
    use(req: Request, res: Response, next: NextFunction) {
      let password = req.body['password'];
      if (password) {
        const slat = setSalt(10);
        password = handleEncrypt(password, slat);
        req.body['password'] = password;
        req.body['salt'] = slat;
      }
      next();
    }
  }
  ```

  + src/modules/user/user.module.ts(修改)

  ```tsx
  ...
  export class UserModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
      consumer
        .apply(EncryptMiddleware)
        .forRoutes('user/register'); // 标明只在用户注册时生效
    }
  }
  ```

  + src/modules/user/user.service.ts(**修改-主要**)

  ```tsx
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
  ```

  + 新建utils文件夹，并新建encrypt.ts文件

  ```tsx
  import * as bcrypt from 'bcrypt';
  
  /**
   * @description 设置盐并返回
   */
  export function setSalt(saltRounds: number): string {
    return bcrypt.genSaltSync(saltRounds);
  }
  
  /**
   * @description 密码加密并返回
   */
  export function handleEncrypt(password: string, salt: string): string {
    const hash = bcrypt.hashSync(password, salt);
    return hash;
  }
  ```

### 9、权限守卫

+ 新建guard文件夹并执行命令行，生成auth.guard.ts文件，将其移动至guard文件夹内

```bash
$ nest g gu auth
```

### 10、jwt身份认证及登录

+ 安装依赖包

```bash
$ yarn add --save @nestjs/jwt passport-jwt @types/passport-jwt
```

+ 输入命令行，生成权限模块文件

```bash
$ nest g mo auth
$ nest g service auth
$ nest g co auth
```

+ 在auth.module.ts文件中，引入UserService

```tsx
...
import { UserService } from 'src/modules/user/user.service';

@Module({
  providers: [AuthService, UserService],
  controllers: [AuthController],
})
...
```

+ 在auth.service.ts文件中，编写用户登录方法

```tsx
import { Injectable } from '@nestjs/common';
import { IResponse } from 'src/interface/response.interface';
import { User } from 'src/interface/user.interface';
import { UserService } from 'src/modules/user/user.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  private response: IResponse;
  constructor(
    private readonly userService: UserService,
  ) {}

  /**
   * @description 用户登录验证
   * @param {User} user
   */
  private async validateUser(user: User) {
    const phone: string = user.phone;
    const password: string = user.password;
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
            msg: '登录成功',
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
    return await this.validateUser(user);
  }
}
```

+ 在auth.controller.ts文件中实现方法调用

```tsx
import { AuthService } from './auth.service';
import { Body, Controller, Post } from '@nestjs/common';
import { User } from 'src/interface/user.interface';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@Controller('auth')
@ApiTags('用户验证模块')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @ApiOperation({
    summary: '用户登录',
  })
  public async userLogin(@Body() userDto: User) {
    return await this.authService.login(userDto);
  }
}
```

+ 将用户注册方法从modules/user文件中提取到权限模块文件中，详见代码
+ 新建jwt.constant.ts文件，存放jwt常量

```tsx
export const jwtConstants = {
  secret: 'secretKey',
};
```

+ 安装依赖

```bash
$ yarn add @nestjs/passport passport passport-local @types/passport-local
```

+ 新建jwt.strategy.ts文件，实现Passport JWT

```tsx
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { jwtConstants } from './jwt.constant';
import { User } from 'src/interface/user.interface';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtConstants.secret,
    });
  }

  async validate(payload: User) {
    return { userId: payload._id };
  }
}
```

+ 进入auth.module.ts文件，引入jwt模块并提供策略

```tsx
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
```

+ 进入auth.service.ts 文件

  + 创建token方法

  ```tsx
  ...
  import { JwtService } from '@nestjs/jwt';
  
  @Injectable()
  export class AuthService {
    ...
    constructor(
      ...
      private readonly jwtService: JwtService,
    ) {}
    ...
    private async createToken(user: User) {
      return await this.jwtService.sign(user);
    }
  }
  ```

  + 完善登录方法

  ```tsx
    /**
     * @description 用户登录验证
     */
    private async validateUser(user: User) {
      const phone: string = user.phone;
      const password: string = user.password;
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
            msg: { token: await this.createToken(user), userId },
          };
          return this.response;
        })
        .catch((err) => {
          return err;
        });
    }
  ```

+ 接口需要用jwt守卫，使用守卫需要用到装饰器，而装饰器需要通过AuthGuard进行守卫，与之前自定义的AuthGuard冲突，需删除项目文件中有关AuthGuard的代码（user.controller.ts、user.module.ts），修改后代码如下

```tsx
import { UserService } from './user.service';
import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Role } from '../role/role.decorator';
import { AuthGuard } from '@nestjs/passport';

@Controller('user')
@ApiTags('用户模块')
@UseGuards(AuthGuard('jwt'))
export class UserController {
  constructor(private userService: UserService) {}

  @Get('hello')
  @Role('admin')
  async hello() {
    return 'hello world!';
  }
}
```

### 11、实现swagger设置请求头

+ 修改main.ts

```tsx
// 添加addBearerAuth方法
const config = new DocumentBuilder()
  .setTitle('nest后台服务Api')
  .setDescription('这里是描述XXXXX')
  .setVersion('1.0')
  .addBearerAuth(
    { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
    'jwt',
  )
  .build();
```

+ 修改user.controller.ts

```tsx
...
@Controller('user')
...
// 添加该方法  'jwt'  需与main文件中的文件一致
@ApiBearerAuth('jwt')
export class UserController {
  ...
}
```

### 12、集成Redis

+ 下载redis客户端

  地址：https://github.com/microsoftarchive/redis/releases

+ 安装依赖

```bash
$ yarn add nestjs-redis
```

+ app.module.ts文件引入

```tsx
...
import { RedisModule, RedisModuleOptions } from 'nestjs-redis';

const options: RedisModuleOptions = {
  host: '127.0.0.1',
  port: 6379,
};

@Module({
  imports: [
    DbModule,
    UserModule,
    Log4jsModule.forRoot(),
    AuthModule,
    RedisModule.register(options),
  ],
  ...
})
```

+ 使用方法(user模块使用)

```tsx
// user.service.ts
...
import { RedisService } from 'nestjs-redis';
import { Redis } from 'ioredis';

@Injectable()
export class UserService {
  private redis: Redis;
  constructor(
    ...
    private readonly redisService: RedisService,
  ) {
    this.redis = this.redisService.getClient();
  }

  ...
  public async hello() {
    return await this.redis.set('management', 'hello world!');
  }
}

// user.controller.ts 即实现swagger调用触发调用hello接口
...
@Controller('user')
@ApiTags('用户模块')
// @UseGuards(AuthGuard('jwt'))
@ApiBearerAuth('jwt')
export class UserController {
  constructor(private userService: UserService) {}

  @Get('hello')
  @Role('admin')
  async hello() {
    // return 'hello world!';
    return await this.userService.hello();
  }
}
```

### 13、用户密码修改接口

+ auth.service.ts

```tsx
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
```

+ auth.controller.ts

```tsx
  @Post('alter')
  @ApiOperation({
    summary: '用户密码修改接口',
  })
  async alterUser(@Body() userDto: User) {
    return await this.authService.alter(userDto);
  }
```

+ auth.module.ts

```tsx
...
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
...
import { EncryptMiddleware } from 'src/middleware/encrypt.middleware';

@Module({
  ...
})
export class AuthModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(EncryptMiddleware).forRoutes('auth/register', 'auth/alter'); // 标明只在用户注册时生效
  }
}
```





