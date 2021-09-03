import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { WsException } from '@nestjs/websockets';
import { JsonWebTokenError, TokenExpiredError } from 'jsonwebtoken';
import { EntityNotFoundError, QueryFailedError, TypeORMError } from 'typeorm';

@Catch(WsException, JsonWebTokenError, TypeORMError)
export class WebsocketExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const client = host.switchToWs().getClient();

    if (exception instanceof WsException) {
      this.sendMessage(client, exception.message);
    } else if (exception instanceof JsonWebTokenError) {
      if (exception instanceof TokenExpiredError)
        this.sendMessage(client, 'Token expired');
      else this.sendMessage(client, exception.message);
    } else if (exception instanceof TypeORMError) {
      if (exception instanceof EntityNotFoundError)
        this.sendMessage(client, 'Not found');
      else if (exception instanceof QueryFailedError)
        this.sendMessage(client, 'Query failed');
      else this.sendMessage(client, exception.message);
    }
  }

  sendMessage(client: any, message: any) {
    client.emit('exception', {
      status: 'error',
      message: message,
    });
  }
}
