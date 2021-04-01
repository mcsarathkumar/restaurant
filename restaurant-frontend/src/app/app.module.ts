import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {FormsModule} from '@angular/forms';
import {APP_DATE_FORMATS, MaterialModule} from './material.module';
import {NgProgressModule} from 'ngx-progressbar';
import {NgProgressHttpModule} from 'ngx-progressbar/http';
import {NgProgressRouterModule} from 'ngx-progressbar/router';
import {MAT_DATE_FORMATS} from '@angular/material/core';
import {AuthGuard} from './_guards/auth.guard';
import {JwtInterceptor} from './_helpers/jwt.interceptor';
import {ErrorInterceptor} from './_helpers/error.interceptor';
import {NavigationService} from './_services/navigation.service';
import {AppService} from './_services/app.service';
import {FixedAppComponent} from './components/navigation/fixed-app/fixed-app.component';
import {HeaderComponent} from './components/navigation/header/header.component';
import {ResponsiveAppComponent} from './components/navigation/responsive-app/responsive-app.component';
import {SidenavListComponent} from './components/navigation/sidenav-list/sidenav-list.component';
import { FooterComponent } from './components/navigation/footer/footer.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import {LoginComponent} from './components/login/login.component';
import { StarRatingComponent } from './shared-components/star-rating/star-rating.component';
import { SignupComponent } from './components/signup/signup.component';
import {AppHttpService} from './_services/app-http.service';
import { DefaultDashboardComponent } from './components/home/default-dashboard/default-dashboard.component';
import { OwnerDashboardComponent } from './components/home/owner-dashboard/owner-dashboard.component';
import { HomeComponent } from './components/home/home.component';
import { RestaurantDetailComponent } from './components/restaurant-detail/restaurant-detail.component';
import {IvyCarouselModule} from 'angular-responsive-carousel';
import { NewRestaurantComponent } from './components/owner/new-restaurant/new-restaurant.component';
import {AdminGuard} from './_guards/admin.guard';
import {OwnerGuard} from './_guards/owner.guard';
import { ManageRestaurantComponent } from './components/owner/manage-restaurant/manage-restaurant.component';
import { EditDialogComponent } from './components/edit-dialog/edit-dialog.component';

@NgModule({
  declarations: [
    AppComponent,
    FixedAppComponent,
    HeaderComponent,
    ResponsiveAppComponent,
    LoginComponent,
    SidenavListComponent,
    FooterComponent,
    StarRatingComponent,
    SignupComponent,
    DefaultDashboardComponent,
    OwnerDashboardComponent,
    HomeComponent,
    RestaurantDetailComponent,
    NewRestaurantComponent,
    ManageRestaurantComponent,
    EditDialogComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    MaterialModule,
    BrowserAnimationsModule,
    FlexLayoutModule,
    NgProgressModule.withConfig({
      color: 'red',
      thick: true,
      spinner: false,
      direction: 'ltr+',
      meteor: false,
      min: 1,
      max: 100,
    }),
    NgProgressHttpModule,
    NgProgressRouterModule,
    IvyCarouselModule,
  ],
  providers: [
    {provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true},
    {provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true},
    {provide: MAT_DATE_FORMATS, useValue: APP_DATE_FORMATS},
    AuthGuard,
    NavigationService,
    AppService,
    AppHttpService,
    AdminGuard,
    OwnerGuard
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
