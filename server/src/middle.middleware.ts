import { Injectable, NestMiddleware } from '@nestjs/common';

@Injectable()
export class MiddleMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: () => void) {
    console.log(req.body);
    next();
  }
}
