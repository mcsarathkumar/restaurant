import {AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
import {NavigationService} from '../../../_services/navigation.service';
import {MediaObserver} from '@angular/flex-layout';
import {navItemsAdmin, navItemsOwner} from '../../../_models/navigation.model';
import {AppService} from '../../../_services/app.service';

@Component({
  selector: 'app-responsive-app',
  templateUrl: './responsive-app.component.html',
  styleUrls: ['./responsive-app.component.css']
})
export class ResponsiveAppComponent implements OnInit, AfterViewInit {

  public navItems;

  public showSideNav = false;

  @ViewChild('sidenav') sidenav: ElementRef;

  constructor(private navigationService: NavigationService,
              public appService: AppService,
              public media: MediaObserver) {
    // media.media$.subscribe();
    media.asObservable().subscribe();
  }

  ngOnInit(): void {
    if (this.appService.userToken) {
      if (this.appService.role === this.appService.userRole.ADMIN) {
        this.navItems = navItemsAdmin;
      } else if (this.appService.role === this.appService.userRole.OWNER) {
        this.navItems = navItemsOwner;
      }
    }
    if (this.navItems) {
      this.showSideNav = true;
    }
  }

  ngAfterViewInit(): void {
    this.navigationService.sidenav = this.sidenav;
  }
}
