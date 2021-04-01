import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ManageRestaurantAdminComponent} from './manage-restaurant-admin/manage-restaurant-admin.component';
import {ManageUsersAdminComponent} from './manage-users-admin/manage-users-admin.component';
import {FormsModule} from '@angular/forms';
import {APP_DATE_FORMATS, MaterialModule} from '../../material.module';
import {FlexLayoutModule} from '@angular/flex-layout';
import {MAT_DATE_FORMATS} from '@angular/material/core';
import {RouterModule} from '@angular/router';
import {AdminRoutingModule} from './admin-routing.module';

@NgModule({
  declarations: [ManageRestaurantAdminComponent, ManageUsersAdminComponent],
  imports: [
    CommonModule,
    FormsModule,
    MaterialModule,
    FlexLayoutModule,
    RouterModule,
    AdminRoutingModule
  ],
  providers: [
    {provide: MAT_DATE_FORMATS, useValue: APP_DATE_FORMATS}
  ]
})
export class AdminModule {}
