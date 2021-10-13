import { ArgumentsHost, Catch, ExceptionFilter, Logger } from '@nestjs/common';
import { EntityNotFoundError, QueryFailedError, TypeORMError } from 'typeorm';
import { Request, Response } from 'express';

@Catch(TypeORMError)
export class TypeOrmExceptionFilter implements ExceptionFilter {
  private logger = new Logger(TypeOrmExceptionFilter.name);

  catch(exception: TypeORMError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const PG_UNIQUE_CONSTRAINT_VIOLATION = '23505';

    if (exception instanceof EntityNotFoundError) {
      response.status(404).json({
        statusCode: 404,
        path: request.url,
        message: 'Not Found',
      });
    } else if (exception instanceof QueryFailedError) {
      if (exception.driverError.code == PG_UNIQUE_CONSTRAINT_VIOLATION) {
        response.status(400).json({
          statusCode: 400,
          path: request.url,
          message: 'Duplicated Nickname',
        });
      } else {
        this.logger.log(exception.message, exception.name);
        response.status(500).json({
          statusCode: 500,
          path: request.url,
          message: exception.message,
        });
      }
    } else {
      this.logger.log(exception.message, exception.name);
      response.status(500).json({
        statusCode: 500,
        path: request.url,
        message: exception.message,
      });
    }
  }
}
