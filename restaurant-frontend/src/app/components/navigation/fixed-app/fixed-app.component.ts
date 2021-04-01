import {AfterViewChecked, AfterViewInit, Component, ElementRef, OnInit, Renderer2, ViewChild} from '@angular/core';
import {navItemsOwner, navItemsAdmin} from '../../../_models/navigation.model';
import {MediaObserver} from '@angular/flex-layout';
import {AppService} from '../../../_services/app.service';
import {MatDrawerContent} from '@angular/material/sidenav';

@Component({
  selector: 'app-fixed-app',
  templateUrl: './fixed-app.component.html',
  styleUrls: ['./fixed-app.component.css']
})
export class FixedAppComponent implements OnInit, AfterViewInit {

  public navItems;
  public showSideNav = false;
  @ViewChild('matDrawerContent') matDrawerContent: MatDrawerContent;

  constructor(public media: MediaObserver, public appService: AppService, public renderer: Renderer2) {
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
    if (!this.showSideNav) {
      this.renderer.addClass(this.matDrawerContent._container._content.getElementRef().nativeElement, 'w-100');
    }
  }
}
