import {ChangeDetectorRef, Component, OnDestroy, OnInit, Renderer2, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {forkJoin, Subscription} from 'rxjs';
import {AppHttpService} from '../../_services/app-http.service';
import {Clipboard} from '@angular/cdk/clipboard';
import {AppService} from '../../_services/app.service';
import {DomSanitizer, SafeUrl} from '@angular/platform-browser';
import {NgForm} from '@angular/forms';
import {Image} from 'angular-responsive-carousel';
import {MatDialog} from '@angular/material/dialog';
import {EditDialogComponent} from '../edit-dialog/edit-dialog.component';

@Component({
  selector: 'app-restaurant-detail',
  templateUrl: './restaurant-detail.component.html',
  styleUrls: ['./restaurant-detail.component.scss']
})
export class RestaurantDetailComponent implements OnInit, OnDestroy {

  routeSubscription = Subscription.EMPTY;
  restaurantId = null;
  isValidRestaurant = false;
  countdownTimer = null;
  restaurantDetails = null;
  restaurantImages = [];
  restaurantReviews = [];
  highestRating = null;
  lowestRating = null;
  activeFilter = 0;
  reviewFilterOptions = [
    {
      buttonDisplay: 'Recent',
      buttonValue: 'recent'
    },
    {
      buttonDisplay: 'High to Low',
      buttonValue: 'hightolow'
    },
    {
      buttonDisplay: 'Low to High',
      buttonValue: 'lowtohigh'
    }
  ];

  @ViewChild('cover') coverDiv: HTMLDivElement;
  backupReviews = [];

  carouselImages: Image[] = [
    {path: '/assets/carousel/Rachel.jpg'},
    {path: '/assets/carousel/fast-food.jpg'},
    {path: '/assets/carousel/gravy.png'},
    {path: '/assets/carousel/Foods-fight-inflammation.jpg'},
    {path: '/assets/carousel/orange.jpg'},
    {path: '/assets/carousel/fry.png'}
  ];

  step = false;
  userRating = 1;
  isCustomer = false;
  isAdmin = false;
  bannerImgUrl = `background: url("/assets/banner-placeholder.jpg")`;
  @ViewChild('commentBox') commentBox: HTMLTextAreaElement;

  constructor(public route: ActivatedRoute, public router: Router, public appHttpService: AppHttpService, private clipboard: Clipboard, public appService: AppService, public domSanitizer: DomSanitizer, public cdr: ChangeDetectorRef, public dialog: MatDialog) {
  }

  ngOnInit(): void {
    if (this.appService.role === this.appService.userRole.CUSTOMER) {
      this.isCustomer = true;
    }
    if (this.appService.role === this.appService.userRole.ADMIN) {
      this.isAdmin = true;
    }
    this.routeSubscription = this.route.params.subscribe(param => {
      this.restaurantId = param.id;
      const forkOptions = {
        details: this.appHttpService.getRestaurantById(this.restaurantId),
        images: this.appHttpService.getRestaurantImages(this.restaurantId),
        reviews: this.appHttpService.getRestaurantReviews(this.restaurantId)
      };
      forkJoin(forkOptions).subscribe(response => {
        if (response['details']) {
          this.isValidRestaurant = true;
          // @ts-ignore
          this.restaurantDetails = response['details'].details;
        }
        if (response['images']) {
          if ((response['images']['images'] as Array<any>).length > 0) {
            (response['images']['images'] as Array<any>).forEach(image => {
              if (image.image_name !== response['images']['mainImage']['thumbnail_image'] && image.image_name !== response['images']['mainImage']['banner_image']) {
                this.restaurantImages.push(image.imagePath);
              }
            });
            if (this.restaurantImages.length > 0) {
              this.restaurantImages.forEach((image, idx) => {
                if (this.carouselImages[idx]) {
                  this.carouselImages[idx].path = image;
                } else {
                  this.carouselImages.push({path: image});
                }
              });
            }
          }
        }
        if (response['reviews']) {
          // @ts-ignore
          this.highestRating = response['reviews'].details[0];
          // @ts-ignore
          this.lowestRating = response['reviews'].details[response['reviews'].details.length - 1];
          // @ts-ignore
          this.backupReviews = response['reviews'].details;
          this.sortByRecent();
        }
      }, error => {
        this.countdownTimer = 5;
      });
      // this.appHttpService.getRestaurantById(this.restaurantId).subscribe(response => {
      //   console.log(response);
      // }, error => {
      //   this.countdownTimer = 2;
      //   setTimeout(() => {
      //     this.router.navigate(['home']);
      //   }, 2000);
      // });
    });
  }

  get whatsappHref(): SafeUrl {
    const url = `*${this.restaurantDetails.name}* \n`;
    const userRating = this.restaurantDetails.user_rating > 0 ? `A ${this.restaurantDetails.user_rating} start rated restaurant in ` : 'A brand new restaurant opened in ';
    const city = this.restaurantDetails.city;
    return this.domSanitizer.bypassSecurityTrustUrl(`whatsapp://send?text=${url}${userRating}${city}`);
  }

  redrawReviews(): void {
    this.appHttpService.getRestaurantReviews(this.restaurantId).subscribe(response => {
      this.highestRating = response.details[0];
      // @ts-ignore
      this.lowestRating = response.details[response.details.length - 1];
      // @ts-ignore
      this.backupReviews = response.details;
      this.activeFilter = 0;
      let userRating = 0;
      this.backupReviews.forEach(item => {
        userRating += item.user_rating;
      });
      this.restaurantDetails.user_rating = Math.round(userRating / this.backupReviews.length);
      this.sortByRecent();
    });
  }

  reviewFilterFn(keyword: string, id: number): void {
    this.activeFilter = id;
    switch (keyword) {
      case 'recent': this.sortByRecent(); break;
      case 'hightolow': this.sortHighestToLowest(); break;
      case 'lowtohigh': this.sortLowestToHighest(); break;
    }
  }

  sortByRecent(): void {
    this.restaurantReviews = JSON.parse(JSON.stringify(this.backupReviews));
    this.restaurantReviews.sort((a, b) => {
      if (new Date(a.commented_on).getTime() > new Date(b.commented_on).getTime()) {
        return -1;
      } else if (new Date(a.commented_on).getTime() === new Date(b.commented_on).getTime()) {
        if (a.user_name > b.user_name) {
          return -1;
        }
      }
    });
  }


  sortHighestToLowest(): void {
    this.restaurantReviews = JSON.parse(JSON.stringify(this.backupReviews));
  }

  sortLowestToHighest(): void {
    this.restaurantReviews = JSON.parse(JSON.stringify(this.backupReviews)).reverse();
  }

  ngOnDestroy(): void {
    this.routeSubscription.unsubscribe();
  }

  copyURL(): void {
    this.clipboard.copy(location.href);
    this.appService.showSnackBar('URL Copied to clipboard');
  }

  reviewsFilter(itemIndex: number): void {
    const selectedFilter = this.reviewFilterOptions[itemIndex].buttonValue;
    this.activeFilter = itemIndex;
  }

  reviewFormSubmit(form: NgForm): void {
    if (form.value.reviewComments && form.value.reviewComments.length > 0) {
      const requestObj = {
        user_rating: this.userRating,
        user_comments: form.value.reviewComments
      };
      this.appHttpService.saveUserComments(this.restaurantId, requestObj).subscribe(response => {
        this.appService.showSnackBar(response.message);
        this.redrawReviews();
        form.resetForm();
        this.userRating = 1;
        this.step = false;
      });
    }
  }

  openReviewForm(): void {
    if (this.isCustomer) {
      this.step = true;
    } else {
      this.appService.showSnackBar('Kindly login to add review comments');
    }
  }

  discardReview(form: NgForm): void {
    form.resetForm();
    this.userRating = 1;
    this.step = false;
    this.cdr.detectChanges();
  }

  captureRating(rating: number): void {
    this.userRating = rating;
    this.commentBox['nativeElement'].focus();
  }

  deleteReview(reviewId: number): void {
    this.appHttpService.deleteReview(reviewId).subscribe(response => {
      this.appService.showSnackBar(response.message);
      this.redrawReviews();
    });
  }

  updateReviewComments(payload): void {
    this.appHttpService.editReview(payload.id, payload).subscribe(response => {
      this.appService.showSnackBar(response.message);
      this.redrawReviews();
    });
  }

  editReview(review): void {
    const dialogRef = this.dialog.open(EditDialogComponent, {
      data: {...review},
      width: '250px',
      hasBackdrop: true,
      role: 'dialog'
    });

    const dialogSub = dialogRef.afterClosed().subscribe(result => {
      if (typeof result === 'object') {
        this.updateReviewComments(result);
      }
      dialogSub.unsubscribe();
    });
  }
}

