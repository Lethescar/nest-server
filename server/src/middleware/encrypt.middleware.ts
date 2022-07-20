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
