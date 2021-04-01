import {Component, OnInit} from '@angular/core';
import {AppHttpService} from '../../../_services/app-http.service';
import {AppService} from '../../../_services/app.service';
import {NgForm} from '@angular/forms';

@Component({
  selector: 'app-manage-restaurant-admin',
  templateUrl: './manage-restaurant-admin.component.html',
  styleUrls: ['./manage-restaurant-admin.component.scss']
})
export class ManageRestaurantAdminComponent implements OnInit {

  selectedRestaurant = 0;
  restaurantList = [];
  chosenOption = '';
  hide = true;

  postalCodePattern = '^(11000[1-9]|1100[1-9][0-9]|110[1-9][0-9]{2}|11[1-9][0-9]{3}|1[2-9][0-9]{4}|[2-7][0-9]{5}|8[0-4][0-9]{4}|85[0-4][0-9]{3}|8550[0-9]{2}|85510[0-9]|85511[0-7])$';
  minPostalCode = 110001;
  maxPostalCode = 855117;
  urlPattern = '^(http:\\/\\/www\\.|https:\\/\\/www\\.|http:\\/\\/|https:\\/\\/)?[a-z0-9]+([\\-\\.]{1}[a-z0-9]+)*\\.[a-z]{2,5}(:[0-9]{1,5})?$';
  mobileNumberPattern = '^([6-9]{1}[0-9]{9})+$';
  cityList = ['Chennai', 'Mumbai', 'Bangalore', 'Hyderabad'];

  name = '';
  phone = '';
  email = '';
  address1 = '';
  address2 = '';
  pincode = '';
  city = '';
  website = '';
  ownerList = [];
  currentOwner = '';

  constructor(private appHttpService: AppHttpService, public appService: AppService) {
  }

  ngOnInit(): void {
    this.getRestaurants();
  }

  getRestaurants(): void {
    this.appHttpService.getAllRestaurants().subscribe(response => {
      this.restaurantList = response.details;
    });
  }

  deleteRestaurant(restaurantId: number): void {
    this.appHttpService.deleteRestaurant(restaurantId).subscribe(response => {
      this.appService.showSnackBar(response.message);
      this.getRestaurants();
      this.selectedRestaurant = 0;
    });
  }

  resetRestaurantSelection(): void {
    this.selectedRestaurant = 0;
    this.chosenOption = '';
  }

  getRestaurantDetailsForEdit(): void {
    this.appHttpService.getRestaurantById(this.selectedRestaurant).subscribe(response => {
      this.name = response.details.name;
      this.phone = response.details.phone;
      this.email = response.details.email;
      this.address1 = response.details.address1;
      this.address2 = response.details.address2;
      this.pincode = response.details.pincode;
      this.city = response.details.city;
      this.website = response.details.website;
      this.currentOwner = response.details.owner;
      this.appHttpService.getUsersList().subscribe(response1 => {
        this.ownerList = response1.details.filter(user => {
          if (user.usertype === this.appService.userRole.OWNER) {
            return true;
          }
        });
        this.chosenOption = 'edit';
      });
    });
  }

  onSubmit(form: NgForm): void {
    this.appHttpService.editRestaurant(this.selectedRestaurant, form.value).subscribe(response => {
      this.appService.showSnackBar(response.message);
      form.resetForm();
      this.resetRestaurantSelection();
      this.getRestaurants();
    });
  }
}
