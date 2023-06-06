import { WsException } from '@nestjs/websockets';

type WsExceptionType = 'BadRequest' | 'Unauthorized' | 'Unknown';

export class WsTypeException extends WsException {
  readonly type: WsExceptionType;

  constructor(type: WsExceptionType, message: string | unknown) {
    const error = {
      type,
      message,
    };
    super(error);
    this.type = type;
  }
}

export class WsBadRequestException extends WsTypeException {
  constructor(message: string | unknown) {
    super('BadRequest', message);
  }
}

export class WsUnauthorizedException extends WsTypeException {
  constructor(message: string | unknown) {
    super('Unauthorized', message);
  }
}

export class WsUnknownException extends WsTypeException {
  constructor(message: string | unknown) {
    super('Unknown', message);
  }
}

export class WsTypeExceptionFactory {
  static createException(
    type: WsExceptionType,
    message: string | unknown,
  ): WsTypeException {
    switch (type) {
      case 'BadRequest':
        return new WsBadRequestException(message);
      case 'Unauthorized':
        return new WsUnauthorizedException(message);
      case 'Unknown':
        return new WsUnknownException(message);
      default:
        throw new Error(`Invalid WsExceptionType: ${type}`);
    }
  }
}
