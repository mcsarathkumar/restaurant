import { Component, OnInit } from '@angular/core';
import {NgForm} from '@angular/forms';
import {AppHttpService} from '../../../_services/app-http.service';
import {AppService} from '../../../_services/app.service';

@Component({
  selector: 'app-new-restaurant',
  templateUrl: './new-restaurant.component.html',
  styleUrls: ['./new-restaurant.component.scss']
})
export class NewRestaurantComponent implements OnInit {

  postalCodePattern = '^(11000[1-9]|1100[1-9][0-9]|110[1-9][0-9]{2}|11[1-9][0-9]{3}|1[2-9][0-9]{4}|[2-7][0-9]{5}|8[0-4][0-9]{4}|85[0-4][0-9]{3}|8550[0-9]{2}|85510[0-9]|85511[0-7])$';
  minPostalCode = 110001;
  maxPostalCode = 855117;
  urlPattern = '^(http:\\/\\/www\\.|https:\\/\\/www\\.|http:\\/\\/|https:\\/\\/)?[a-z0-9]+([\\-\\.]{1}[a-z0-9]+)*\\.[a-z]{2,5}(:[0-9]{1,5})?$';
  mobileNumberPattern = '^([6-9]{1}[0-9]{9})+$';
  cityList = ['Chennai', 'Mumbai', 'Bangalore', 'Hyderabad'];



  constructor(private appHttpService: AppHttpService, private appService: AppService) { }

  ngOnInit(): void {
  }

  saveRestaurant(f: NgForm): void {
    this.appHttpService.saveRestaurant(f.value).subscribe(response => {
      f.resetForm();
      this.appService.showSnackBar(response.message);
    });
  }

}
