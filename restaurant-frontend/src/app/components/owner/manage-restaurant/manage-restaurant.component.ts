import { Component, OnInit } from '@angular/core';
import {AppHttpService} from '../../../_services/app-http.service';
import {AppService} from '../../../_services/app.service';
import {NgForm} from '@angular/forms';

@Component({
  selector: 'app-manage-restaurant',
  templateUrl: './manage-restaurant.component.html',
  styleUrls: ['./manage-restaurant.component.scss']
})
export class ManageRestaurantComponent implements OnInit {

  selectedRestaurant = 0;
  ownedRestaurants = [];
  acceptFileType = ['image/jpeg', 'image/png'];
  fileName = '';
  fileData: File = null;
  byte = 1;
  kilebyte = 1024 * this.byte;
  megabyte = 1024 * this.kilebyte;
  chosenOption = '';
  bannerImage = '';
  thumbnailImage = '';
  images = [];

  constructor(private appHttpService: AppHttpService, public appService: AppService) { }

  ngOnInit(): void {
    this.getOwnedRestaurants();
  }

  getOwnedRestaurants(): void {
    this.appHttpService.getOwnedRestaurants().subscribe(response => {
      this.ownedRestaurants = response.details;
    });
  }

  changeFileName(event): void {
    const element = event.target;
    if (element.files.length > 0) {
      if (element.files[0].size < this.megabyte) {
        if (this.acceptFileType.indexOf(element.files[0].type) > -1) {
          this.fileName = element.files[0].name;
          this.fileData = element.files[0];
        } else {
          this.fileName = '';
          this.fileData = null;
          this.appService.showSnackBar('File Type is Invalid');
        }
      } else {
        this.fileName = '';
        this.appService.showSnackBar('File Size should be below 1MB');
      }
    } else {
      this.fileName = '';
    }
  }

  onSubmit(form: NgForm): void {
    const fd = new FormData();
    fd.append('restaurantImage', this.fileData, this.fileName);
    this.appHttpService.uploadImage(this.selectedRestaurant, fd).subscribe(response => {
      form.resetForm();
      this.fileData = null;
      this.fileName = '';
      this.appService.showSnackBar(response.message);
    });
  }

  showPhotos(): void {
    this.chosenOption = 'show';
    this.appHttpService.getRestaurantImages(this.selectedRestaurant).subscribe(response => {
      this.images = response.images;
      this.thumbnailImage = response.mainImage.thumbnail_image;
      this.bannerImage = response.mainImage.banner_image;
    });
  }

  updateImage(type: 'banner' | 'thumbnail', imageId: number): void {
    this.appHttpService.updateImage(this.selectedRestaurant, type, imageId).subscribe(response => {
      this.appService.showSnackBar(response.message);
      this.showPhotos();
    });
  }

  deleteImage(imageId: number): void {
    this.appHttpService.deleteImage(this.selectedRestaurant, imageId).subscribe(response => {
      this.appService.showSnackBar(response.message);
      this.showPhotos();
    });
  }

}
