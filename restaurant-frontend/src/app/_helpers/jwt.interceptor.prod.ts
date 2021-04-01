import {Injectable} from '@angular/core';
import {HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpResponse, HttpHeaderResponse} from '@angular/common/http';
import {EMPTY, Observable} from 'rxjs';
import {AppService} from '../_services/app.service';
import {tap} from 'rxjs/operators';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {

  constructor(private appService: AppService) {
  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const currentUser = this.appService.userToken;
    if (currentUser) {
      request = request.clone({
        setHeaders: {
          Authorization: currentUser
        }
      });
    }
    return next.handle(request)
      .pipe(tap((event: HttpEvent<any>) => {
        if (event instanceof HttpResponse) {
          if (event.headers.get('Authorization') !== null && event.headers.get('Authorization') !== undefined) {
            this.appService.userToken = event.headers.get('Authorization');
          }
          if (event.headers.get('content-disposition') !== null && event.headers.get('content-disposition') !== undefined) {
            let contentDisposition = event.headers.get('content-disposition');
            contentDisposition = contentDisposition.replace(/\"/g, '');
            contentDisposition = contentDisposition.replace(/\'/g, '');
            const fileName = contentDisposition.split('=');
          }
        }
        return event;
      }, () => {
      }, () => {
      }));
  }
}
