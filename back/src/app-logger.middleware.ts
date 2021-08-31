import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

@Injectable()
export class AppLoggerMiddleware implements NestMiddleware {
  private logger = new Logger('HTTP');

  use(req: Request, res: Response, next: NextFunction) {
    const { ip, method, originalUrl } = req;

    res.on('finish', () => {
      const { statusCode } = res;

      this.logger.log(`${method} ${originalUrl} ${statusCode} - ${ip}`);
    });

    next();
  }
}
