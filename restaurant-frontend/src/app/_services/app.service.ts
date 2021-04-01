import {Injectable} from '@angular/core';
import {Subject} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {Router} from '@angular/router';
import {MatSnackBar} from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})

export class AppService {

  userToken = null;
  role = null;
  userRole = {
    ADMIN: 'admin',
    OWNER: 'owner',
    CUSTOMER: 'customer',
  };
  loggingSubject = new Subject<boolean>();

  constructor(
    private snackbar: MatSnackBar,
    private http: HttpClient,
    private router: Router) {
  }


  safeInput(input): string {
    if (input !== null && input !== undefined && input.toString().trim() !== '') {
      return input.toString().trim();
    } else {
      return '';
    }
  }

  showSnackBar(data, action = 'Dismiss', time = 3000): void {
    data = this.safeInput(data);
    if (data !== '') {
      const bar = this.snackbar.open(data, action, {
        duration: time,
        panelClass: 'snackbar-center',
        horizontalPosition: 'center'
      });
      let isDismissed = false;
      const actionSub = bar.onAction().subscribe(() => {
        isDismissed = true;
        bar.dismiss();
        actionSub.unsubscribe();
      });
      setTimeout(() => {
        if (!isDismissed) {
          actionSub.unsubscribe();
        }
      }, time);
    }
  }

  validateJSON(input): boolean {
    try {
      const json = JSON.parse(input);
      if (Object.prototype.toString.call(json).slice(8, -1) !== 'Object') {
        return false;
      }
    } catch (e) {
      return false;
    }
    return true;
  }

  hasAccess(input): void {
    if (this.role !== input) {
      this.router.navigate(['/dashboard']);
    }
  }

  // tslint:disable-next-line:variable-name
  sortArrayByColumnName(sort_data: Array<object>, key, order = 1): Array<object> {
    if (sort_data.length > 1 && this.safeInput(key) !== '') {
      for (let i = 0; i < sort_data.length; i++) {
        for (let j = i + 1; j < sort_data.length; j++) {
          if (sort_data[i][key] > sort_data[j][key]) {
            const temp = sort_data[i][key];
            sort_data[i][key] = sort_data[j][key];
            sort_data[j][key] = temp;
          }
        }
      }
      if (order === 1) {
        return sort_data;
      } else {
        return sort_data.reverse();
      }
    } else {
      return sort_data;
    }
  }

  dateWithTimeToDate(input): string {
    input = this.safeInput(input);
    if (input !== '') {
      const options = {year: 'numeric', month: 'short', day: 'numeric'};
      return new Date(input).toLocaleDateString('en-US', options);
    }
  }

  array_filter(arr, column, searchKeyword): Array<object> {
    column = this.safeInput(column);
    searchKeyword = this.safeInput(searchKeyword);
    if (arr.length > 0 && searchKeyword !== '' && column !== '') {
      const value = searchKeyword.toLowerCase();
      return arr.filter(response => response[column].toLowerCase().includes(value));
    } else {
      return arr;
    }
  }


}
