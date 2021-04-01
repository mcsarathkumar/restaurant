import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {LoginComponent} from './components/login/login.component';
import {SignupComponent} from './components/signup/signup.component';
import {HomeComponent} from './components/home/home.component';
import {RestaurantDetailComponent} from './components/restaurant-detail/restaurant-detail.component';
import {NewRestaurantComponent} from './components/owner/new-restaurant/new-restaurant.component';
import {OwnerGuard} from './_guards/owner.guard';
import {AdminGuard} from './_guards/admin.guard';
import {ManageRestaurantComponent} from './components/owner/manage-restaurant/manage-restaurant.component';

const routes: Routes = [
  {path: 'login', component: LoginComponent},
  {path: 'signup', component: SignupComponent},
  {path: '', pathMatch: 'full', redirectTo: 'home'},
  {path: 'home', component: HomeComponent},
  {path: 'restaurant/:id', component: RestaurantDetailComponent},
  {path: 'add-restaurant', component: NewRestaurantComponent, canActivate: [OwnerGuard]},
  {path: 'manage-restaurant', component: ManageRestaurantComponent, canActivate: [OwnerGuard]},
  {path: 'admin', loadChildren: () => import('./components/admin/admin.module').then(m => m.AdminModule), canActivate: [AdminGuard]},
  {path: '**', redirectTo: 'home'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
