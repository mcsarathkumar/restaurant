import {Component, Input, OnInit} from '@angular/core';
import {NavigationService} from '../../../_services/navigation.service';
import {AuthenticationService} from '../../../_services/authentication.service';
import {AppService} from '../../../_services/app.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  @Input() showSideNav = false;

  constructor(private navigationService: NavigationService,
              private authenticationService: AuthenticationService,
              public appService: AppService,
              private router: Router) {
  }

  ngOnInit(): void {


    const token = this.appService.userToken;
    if (token && token !== '') {
      const custominterval1 = setInterval(() => {
        // const token = localStorage.getItem('token');
        const t = token.split('.');
        const temp = JSON.parse(atob(t[1]));
        const result = temp['exp'] - Math.floor(new Date().getTime() / 1000);
        if (result < 60) {
          clearInterval(custominterval1);
          this.authenticationService.logout().subscribe();
          return false;
        } else {
          return true;
        }
      }, 60000);
    }
  }

  onToggleSidenav(): void {
    this.navigationService.toggleNav();
  }

  onLogout(): void {
    this.authenticationService.logout().subscribe(() => this.router.navigate(['dashboard']));
  }
}
