import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {tap} from 'rxjs/operators';
import {environment} from '../../environments/environment';
import {Router} from '@angular/router';
import {AppService} from './app.service';
import {CustomLogin} from '../_models/custom.model';
import {Observable} from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthenticationService {
    constructor(private http: HttpClient,
                private router: Router,
                private appService: AppService) { }

  login(loginData: CustomLogin): Observable<any> {
    return this.http.post<any>(environment.apiUrl + 'signin', loginData).pipe(tap(
      response => {
        const userDetRaw = atob(response['token'].split('.')[1]);
        const userDet = JSON.parse(userDetRaw);
        this.appService.userToken = 'Bearer ' + response['token'];
        this.appService.role = JSON.parse(localStorage.getItem('role'));
      }
    ));
  }

  
  signup(signupData: CustomSignup): Observable<any> {
    return this.http.post<any>(environment.apiUrl + ApiConstants.SIGN_UP, signupData).pipe(tap(
      response => {
        this.appService.loggingSubject.next(true);
        const userDetRaw = atob(response.token.split('.')[1]);
        const userDet = JSON.parse(userDetRaw);
        console.log(userDet);
        localStorage.setItem('token', 'Bearer ' + response.token);
        localStorage.setItem('role', userDet.entitlement);
        this.appService.userToken = 'Bearer ' + response.token;
        this.appService.role = localStorage.getItem('role');
      }
    ));
  }

  logout(): Observable<any> {
    return this.http.get(environment.apiUrl + 'signout').pipe(tap(response => {
      this.appService.userToken = null;
      this.appService.role = '';
    }));
  }
}
