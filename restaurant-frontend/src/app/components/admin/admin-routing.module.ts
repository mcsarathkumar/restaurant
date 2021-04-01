import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {ManageRestaurantAdminComponent} from './manage-restaurant-admin/manage-restaurant-admin.component';
import {ManageUsersAdminComponent} from './manage-users-admin/manage-users-admin.component';

const routes: Routes = [
  {path: '', pathMatch: 'full', redirectTo: 'users'},
  {path: 'restaurant', component: ManageRestaurantAdminComponent},
  {path: 'users', component: ManageUsersAdminComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule {
}
