import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  HttpException,
  HttpStatus,
  BadRequestException
} from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ValidationError} from 'joi';


@Injectable()
export class ErrorInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      catchError((error) => {
   
        if (error instanceof ValidationError || error instanceof BadRequestException) {
          throw new HttpException(
            {
              statusCode: HttpStatus.BAD_REQUEST,
              statusMessage: error.message,
            },
            HttpStatus.BAD_REQUEST,
          );
        }

        if (error instanceof HttpException) {
          throw new HttpException(
            {
              statusCode: HttpStatus.BAD_REQUEST,
              statusMessage: error.getResponse(),

            },
            HttpStatus.BAD_REQUEST,
          );
        }

        if (error instanceof BadRequestException) {
          const response = error.getResponse();
          return throwError(
            () =>
              new HttpException(
                {
                  statusCode: HttpStatus.BAD_REQUEST,
                  statusMessage: response,
                  data: response,
                },
                HttpStatus.BAD_REQUEST,
              ),
          );
        }


        throw new HttpException(
          {
            statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
            statusMessage: 'Something Went Wrong',
            data: error.message,
          },
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }),
    );
  }
}
