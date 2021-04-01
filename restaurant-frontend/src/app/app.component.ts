import {AfterViewChecked, ChangeDetectorRef, Component, HostListener, OnDestroy, OnInit} from '@angular/core';
import {AppService} from './_services/app.service';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy{

  private loggingSubscription = Subscription.EMPTY;
  isLoggedIn = false;
  renderComponents = true;

  @HostListener('window:resize', ['$event'])
  onResize(event): void {
    // if (this.cdr) {
    //   this.renderComponents = false;
    //   this.cdr.detectChanges();
    //   this.renderComponents = true;
    // }
  }

  constructor(public appService: AppService, public cdr: ChangeDetectorRef) {
  }

  ngOnInit(): void {
    this.loggingSubscription = this.appService.loggingSubject.subscribe(data => {
      this.renderComponents = false;
      this.cdr.detectChanges();
      this.renderComponents = true;
    });
    this.isLoggedIn = typeof this.appService.userToken === 'string';
    this.appService.userToken = localStorage.getItem('token');
    this.appService.role =  localStorage.getItem('role');
  }


  ngOnDestroy(): void {
    this.loggingSubscription.unsubscribe();
  }

}
