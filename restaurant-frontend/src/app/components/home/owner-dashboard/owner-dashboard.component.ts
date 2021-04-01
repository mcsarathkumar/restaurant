import { Component, OnInit } from '@angular/core';
import {AppService} from '../../../_services/app.service';
import {AppHttpService} from '../../../_services/app-http.service';

@Component({
  selector: 'app-owner-dashboard',
  templateUrl: './owner-dashboard.component.html',
  styleUrls: ['./owner-dashboard.component.scss']
})
export class OwnerDashboardComponent implements OnInit {

  restaurantList = [];
  perPageLimit = 3;
  currentPage = 0;
  restaurantsByPage = [];

  constructor(private appService: AppService, private appHttpService: AppHttpService) { }

  ngOnInit(): void {
    this.getPendingActions();
  }

  getPendingActions(): void {
    this.appHttpService.getPendingActions().subscribe(response => {
      this.restaurantList = response.details;
      this.restaurantList.map(restaurant => {
        restaurant.badgeCount = restaurant.actionItems.length;
        return restaurant;
      });
      console.log(this.currentPage * this.perPageLimit, (this.currentPage+1) * this.perPageLimit);
      this.restaurantsByPage = this.restaurantList[0].actionItems.slice(this.currentPage * this.perPageLimit, (this.currentPage+1) * this.perPageLimit );
      console.log(this.restaurantsByPage);
    });
  }

  saveOwnerComments(restaurantIdx: number, actionItemIdx: number, restaurantId: number, commentId: number, ownerComments: string): void {
    const reqObj = {
      id: commentId,
      owner_comments: ownerComments
    };
    this.appHttpService.saveOwnerComments(restaurantId, reqObj).subscribe(response => {
      this.appService.showSnackBar(response.message);
      this.restaurantList[restaurantIdx].badgeCount--;
      this.restaurantList[restaurantIdx].actionItems.splice(actionItemIdx, 1);
      if (this.restaurantList[restaurantIdx].badgeCount === 0) {
        this.restaurantList.splice(restaurantIdx, 1);
      }
    });
  }

  nextPage() {
    this.currentPage++;
    this.restaurantsByPage = this.restaurantList[0].actionItems.slice(this.currentPage * this.perPageLimit, (this.currentPage+1) * this.perPageLimit );    
  }

  prevPage() {
    this.currentPage--;
    this.restaurantsByPage = this.restaurantList[0].actionItems.slice(this.currentPage * this.perPageLimit, (this.currentPage+1) * this.perPageLimit );    
  }
}
