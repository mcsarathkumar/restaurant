import {Component, OnInit} from '@angular/core';
import {AppService} from '../../_services/app.service';
import {ActivatedRoute, Router} from '@angular/router';
import {CustomLogin, CustomSignup} from '../../_models/custom.model';
import {HttpClient} from '@angular/common/http';
import {AuthenticationService} from '../../_services/authentication.service';
import {NgForm} from '@angular/forms';
import {AppHttpService} from '../../_services/app-http.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {

  email = '';
  hide = true;
  phoneNo = '';

  // tslint:disable-next-line:new-parens
  signupData = new class implements CustomSignup {
    firstname: string;
    lastname: string;
    phone: number;
    usertype: string;
    email: string;
    password: string;
  };

  constructor(public router: Router,
              private http: HttpClient,
              private appService: AppService,
              private authenticationService: AuthenticationService,
              private appHttpService: AppHttpService) {
  }

  ngOnInit(): void {
    if (this.appService.userToken && this.appService.role) {
      this.router.navigate(['dashboard']);
    }
  }

  onSubmit(form: NgForm): void {
    this.signupData.email = this.appService.safeInput(form.value.email);
    this.signupData.password = this.appService.safeInput(form.value.password);
    this.signupData.firstname = this.appService.safeInput(form.value.firstname);
    this.signupData.lastname = this.appService.safeInput(form.value.lastname);
    this.signupData.phone = parseInt(this.appService.safeInput(form.value.phone), 10);
    this.signupData.usertype = this.appService.safeInput(form.value.usertype);

    this.authenticationService.signup(this.signupData)
      .subscribe(
        (data) => {
          this.router.navigateByUrl('/dashboard');
          this.appService.showSnackBar('Welcome !!!');
        });
  }

  preValidateEmail(email: string): void {
    this.appHttpService.preValidateEmail(email).subscribe(response => {
    }, error => {
      if (error.error.message !== 'Invalid field values') {
        this.email = '';
      }
    });
  }
}
