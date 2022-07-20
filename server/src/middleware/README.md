#中间件使用

举例：

- 新建 middleware 文件夹存放中间件文件
- 新建 encrypt.middleware.ts 文件 作为*加密*中间件

- 在用户模块 modules/user/user.module.ts 文件中调用*加密*中间件
  ```
  export class UserModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
      consumer.apply(EncryptMiddleware).forRoutes('user'); // 标明只在用户模块下生效
    }
  }
  ```
