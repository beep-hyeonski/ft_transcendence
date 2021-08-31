import { ArgumentsHost, Catch, ExceptionFilter, Logger } from '@nestjs/common';
import { Request, Response } from 'express';
import { JsonWebTokenError, TokenExpiredError } from 'jsonwebtoken';

@Catch(JsonWebTokenError)
export class JwtExceptionFilter implements ExceptionFilter {
  private logger = new Logger(JwtExceptionFilter.name);

  catch(exception: JsonWebTokenError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    if (exception instanceof TokenExpiredError) {
      response.status(401).json({
        statusCode: 401,
        path: request.url,
        message: 'Token Expired',
      });
    } else {
      if (exception.message == 'invalid token') {
        response.status(401).json({
          statusCode: 401,
          path: request.url,
          message: exception.message,
        });
      } else {
        response.status(400).json({
          statusCode: 400,
          path: request.url,
          message: exception.message,
        });
      }
    }
  }
}
