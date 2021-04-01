import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {ApiConstants} from '../_constants/app.constants';
import {environment} from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AppHttpService {

  constructor(private http: HttpClient) { }

  preValidateEmail(email: string): Observable<any> {
    return this.http.get(environment.apiUrl + ApiConstants.PRE_VALIDATE_EMAIL + email);
  }

  preValidateEmailEdit(userId: number, email: string): Observable<any> {
    return this.http.get(environment.apiUrl + ApiConstants.PRE_VALIDATE_EMAIL_EDIT + userId + '/' + email);
  }

  getAllRestaurants(): Observable<any> {
    return this.http.get(environment.apiUrl + ApiConstants.GET_ALL_RESTAURANTS);
  }

  getRestaurantById(id: number): Observable<any> {
    return this.http.get(environment.apiUrl + ApiConstants.GET_RESTAURANT_BY_ID + id);
  }

  getRestaurantImages(id: number): Observable<any> {
    return this.http.get(environment.apiUrl + ApiConstants.GET_RESTAURANT_IMAGES + id);
  }

  getRestaurantReviews(id: string): Observable<any> {
    return this.http.get(environment.apiUrl + ApiConstants.GET_REVIEWS_BY_ID + id);
  }

  saveUserComments(restaurantId: number, payload: object): Observable<any> {
    return this.http.post(environment.apiUrl + ApiConstants.SAVE_COMMENTS + restaurantId, payload);
  }

  saveOwnerComments(restaurantId: number, payload: object): Observable<any> {
    return this.http.put(environment.apiUrl + ApiConstants.SAVE_COMMENTS_OWNER + restaurantId, payload);
  }

  getPendingActions(): Observable<any> {
    return this.http.get(environment.apiUrl + ApiConstants.GET_PENDING_ACTIONS);
  }

  saveRestaurant(payload): Observable<any> {
    return this.http.post(environment.apiUrl + ApiConstants.NEW_RESTAURANT, payload);
  }

  getOwnedRestaurants(): Observable<any> {
    return this.http.get(environment.apiUrl + ApiConstants.GET_OWNED_RESTAURANTS);
  }

  uploadImage(restaurantId: number, fd: FormData): Observable<any> {
    return this.http.post(environment.apiUrl + ApiConstants.UPLOAD_IMAGE + restaurantId, fd);
  }

  showImages(restaurantId: number): Observable<any> {
    return this.http.get(environment.apiUrl + ApiConstants.SHOW_IMAGES + restaurantId);
  }

  getUsersList(): Observable<any> {
    return this.http.get(environment.apiUrl + ApiConstants.GET_USERS);
  }

  deleteUser(userId: number): Observable<any> {
    return this.http.delete(environment.apiUrl + ApiConstants.DELETE_USER + userId);
  }

  getUserDetails(userId: number): Observable<any> {
    return this.http.get(environment.apiUrl + ApiConstants.GET_USER_DETAILS + userId);
  }

  editUser(userId: number, payload): Observable<any> {
    return this.http.put(environment.apiUrl + ApiConstants.UPDATE_USER + userId, payload);
  }

  deleteRestaurant(restaurantId: number): Observable<any> {
    return this.http.delete(environment.apiUrl + ApiConstants.DELETE_RESTAURANT + restaurantId);
  }

  editRestaurant(restaurantId: number, payload): Observable<any> {
    return this.http.put(environment.apiUrl + ApiConstants.DELETE_RESTAURANT + restaurantId, payload);
  }

  deleteReview(reviewId: number): Observable<any> {
    return this.http.delete(environment.apiUrl + ApiConstants.DELETE_REVIEW + reviewId);
  }

  editReview(reviewId: number, payload): Observable<any> {
    return this.http.put(environment.apiUrl + ApiConstants.UPDATE_REVIEW + reviewId, payload);
  }

  updateImage(restaurantId: number, type: 'banner' | 'thumbnail', imageId: number): Observable<any> {
    return this.http.get(`${environment.apiUrl}${ApiConstants.UPDATE_IMAGE}${restaurantId}/${type}/${imageId}`);
  }

  deleteImage(restaurantId: number, imageId: number): Observable<any> {
    return this.http.delete(`${environment.apiUrl}${ApiConstants.DELETE_IMAGE}${restaurantId}/${imageId}`);
  }

}
