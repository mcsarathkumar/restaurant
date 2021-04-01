import {Component, OnInit} from '@angular/core';
import {NgForm} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {AppService} from '../../_services/app.service';
import {HttpClient} from '@angular/common/http';
import {AuthenticationService} from '../../_services/authentication.service';
import {CustomLogin} from '../../_models/custom.model';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  rememberModel = true;
  returnUrl: string;
  email = '';
  hide = true;
  // tslint:disable-next-line:new-parens
  loginData = new class implements CustomLogin {
    email: string;
    password: string;
  };

  constructor(public router: Router,
              private route: ActivatedRoute,
              private http: HttpClient,
              private appService: AppService,
              private authenticationService: AuthenticationService) {
  }

  ngOnInit(): void {
    if (this.appService.userToken && this.appService.role) {
      this.router.navigate(['dashboard']);
    }
  }

  onSubmit(form: NgForm): void {

    this.loginData.email = this.appService.safeInput(form.value.email);
    this.loginData.password = this.appService.safeInput(form.value.password);

    this.authenticationService.login(this.loginData)
      .subscribe(
        (data) => {
          this.router.navigateByUrl('/dashboard');
          this.appService.showSnackBar('Welcome !!!');
        });
  }
}
