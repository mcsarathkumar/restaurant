import { Component, OnInit } from '@angular/core';
import {AppService} from '../../_services/app.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  constructor(private appService: AppService) { }

  isGuest = true;
  isCustomer = false;
  isOwner = false;
  isAdmin = false;

  ngOnInit(): void {
    if (this.appService.userToken) {
      this.isGuest = false;
      switch (this.appService.role) {
        case this.appService.userRole.CUSTOMER: this.isCustomer = true; break;
        case this.appService.userRole.OWNER: this.isOwner = true; break;
        case this.appService.userRole.ADMIN: this.isAdmin = true; break;
      }
    } else {
      this.isGuest = true;
      this.isCustomer = false;
      this.isOwner = false;
      this.isAdmin = false;
    }

  }

}
