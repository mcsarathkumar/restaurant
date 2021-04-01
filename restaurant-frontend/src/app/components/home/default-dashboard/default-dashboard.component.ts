import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {AppHttpService} from '../../../_services/app-http.service';
import {AppService} from '../../../_services/app.service';

@Component({
  selector: 'app-default-dashboard',
  templateUrl: './default-dashboard.component.html',
  styleUrls: ['./default-dashboard.component.scss']
})
export class DefaultDashboardComponent implements OnInit {

  location = 'All';
  ratingFilter = 'All';
  activeFilter = 0;
  restaurantFilterOptions = [
    {
      buttonDisplay: 'High to Low',
      buttonValue: 'hightolow'
    },
    {
      buttonDisplay: 'Low to High',
      buttonValue: 'lowtohigh'
    }
  ];
  restaurantList = [];
  backupRestaurantList = [];
  cityList = ['Chennai', 'Mumbai', 'Bangalore', 'Hyderabad'];
  filterOptions = [
    {
      value: 4,
      description: '4 or above'
    },
    {
      value: 3,
      description: '3 or above'
    },
    {
      value: 2,
      description: '2 or above'
    },
    {
      value: 1,
      description: '1 or above'
    },
  ];
  filterValue = '';

  constructor(public appService: AppService, public router: Router, private appHttpService: AppHttpService) {
  }

  ngOnInit(): void {
    this.getAllRestaurants();
  }

  getAllRestaurants(): void {
    this.appHttpService.getAllRestaurants().subscribe(response => {
      this.backupRestaurantList = response.details;
      this.restaurantList = [...this.backupRestaurantList];
    });
  }

  changeLocationFn(): void {
    this.ratingFilter = 'All';
    this.changeLocation();
  }

  changeLocation(): void {
    if (this.location === 'All') {
      this.restaurantList = [...this.backupRestaurantList];
    } else {
      this.restaurantList = this.backupRestaurantList.filter(restaurant => {
        if (restaurant.city === this.location) {
          return true;
        }
      });
    }
  }

  filterRestaurantFn(): void {
    this.ratingFilter = 'All';
    this.filterRestaurant();
  }

  filterRestaurant(): void {
    if (this.filterValue === '') {
      this.changeLocation();
    } else if (this.location === 'All') {
      this.restaurantList = this.backupRestaurantList.filter(restaurant => {
        if (restaurant.name.toLowerCase().indexOf(this.filterValue.toLowerCase()) > -1) {
          return true;
        }
      });
    } else {
      this.restaurantList = this.backupRestaurantList.filter(restaurant => {
        if (restaurant.city === this.location && restaurant.name.toLowerCase().indexOf(this.filterValue.toLowerCase()) > -1) {
          return true;
        }
      });
    }
  }

  ratingFilterFn(): void {
    this.filterRestaurant();
    if (this.ratingFilter !== 'All') {
      this.restaurantList = this.restaurantList.filter(restaurant => {
        if (restaurant.user_rating >= this.ratingFilter) {
          return true;
        }
      });
    }
  }
}
