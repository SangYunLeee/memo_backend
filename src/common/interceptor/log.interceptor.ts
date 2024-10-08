import {
  CallHandler,
  ExecutionContext,
  HttpException,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class LogInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const myUUID = generateShortUUID();
    const req = context.switchToHttp().getRequest();
    const now = Date.now();
    console.log(`<REQ> ${myUUID}
  path      : ${req.originalUrl}
  starttime : ${new Date(now).toLocaleString('ko')}
  method    : ${req.method}
  ip        : ${req.ip}
  body      : ${JSON.stringify(req.body)}
  query     : ${JSON.stringify(req.query)}
<REQ/>
  `);
    return next.handle().pipe(
      catchError(async (e: HttpException) => {
        if (
          e instanceof HttpException &&
          e.getStatus() >= 400 &&
          e.getStatus() < 500
        ) {
          throw e;
        }
        console.error(`[ERR] ${myUUID} ${req.originalUrl}`);
        console.error(`stack: \n ${e.stack}`);
        console.log(
          `[RES END] ${myUUID} ${req.originalUrl} ${new Date().toLocaleString('ko')} ${Date.now() - now}ms`,
        );
        throw e;
      }),
      tap((observable) => {
        console.log(
          `[RES END] ${myUUID} ${req.originalUrl} ${new Date().toLocaleString('ko')} ${Date.now() - now}ms`,
        );
      }),
    );
  }
}

function generateShortUUID() {
  const fullUUID = uuidv4();
  return fullUUID.split('-')[0];
}
