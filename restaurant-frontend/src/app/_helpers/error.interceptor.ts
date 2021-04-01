import { Injectable } from '@angular/core';
import {HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpErrorResponse, HttpResponse} from '@angular/common/http';
import {EMPTY, Observable, throwError} from 'rxjs';
import {catchError} from 'rxjs/operators';

import {Router} from '@angular/router';
import {AppService} from '../_services/app.service';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
    constructor(private appService: AppService,
                private router: Router) {    }

    private handleError(cError: HttpErrorResponse): Observable<any> {
    if (cError.headers.has('authorization') && cError.headers.get('authorization') !== null) {
      localStorage.setItem('token', cError.headers.get('authorization'));
    }
    if (cError.error instanceof ErrorEvent) {
      this.appService.showSnackBar('Network Error occurred:');
    } else {
      if (typeof cError.error.error === 'string') {
        this.appService.showSnackBar(cError.error.error);
      } else if (typeof cError.error.message === 'string') {
        this.appService.showSnackBar(cError.error.message);
      }
      else {
        if (typeof cError.error !== 'undefined' && cError.error.error instanceof Object) {
          let prop;
          const attributes = [];
          for (prop in cError.error.error) {
            attributes.push(prop);
          }
            if (cError.error.error[attributes[0]].toString().trim() !== '') {
            this.appService.showSnackBar(cError.error.error[attributes[0]]);
          }
        } else {
          console.log(cError.error);
          console.log(cError.message);
        }
      }
    }
    if (cError.status === 401 || cError.error.message === 'Token has expired and can no longer be refreshed') {
      if (cError.headers.get('authorization') !== null) {
        cError.headers.set('authorization', null);
      }
      if (localStorage.hasOwnProperty('token')) {
        localStorage.removeItem('token');
      }
      if (localStorage.hasOwnProperty('role')) {
        localStorage.removeItem('role');
      }
      this.router.navigate(['/login']);
    }
    return throwError(cError);
  }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(request).pipe(catchError((err: HttpErrorResponse) => this.handleError(err)));
    }
}
