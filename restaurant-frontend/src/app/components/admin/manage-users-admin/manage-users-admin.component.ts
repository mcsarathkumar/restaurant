import {Component, OnInit} from '@angular/core';
import {AppHttpService} from '../../../_services/app-http.service';
import {AppService} from '../../../_services/app.service';
import {NgForm} from '@angular/forms';

@Component({
  selector: 'app-manage-users-admin',
  templateUrl: './manage-users-admin.component.html',
  styleUrls: ['./manage-users-admin.component.scss']
})
export class ManageUsersAdminComponent implements OnInit {

  selectedUser = 0;
  userList = [];
  chosenOption = '';
  hide = true;

  firstname = '';
  lastname = '';
  phone = '';
  usertype = '';
  email = '';


  constructor(private appHttpService: AppHttpService, public appService: AppService) {
  }

  ngOnInit(): void {
    this.getUsers();
  }

  getUsers(): void {
    this.appHttpService.getUsersList().subscribe(response => {
      this.userList = response.details;
    });
  }

  deleteUser(userId: number): void {
    this.appHttpService.deleteUser(userId).subscribe(response => {
      this.appService.showSnackBar(response.message);
      this.getUsers();
      this.selectedUser = 0;
    });
  }

  resetUserSelection(): void {
    this.selectedUser = 0;
    this.chosenOption = '';
  }

  getUserDetailsForEdit(): void {
    this.appHttpService.getUserDetails(this.selectedUser).subscribe(response => {
      this.chosenOption = 'edit';
      this.firstname = response.details[0].firstname;
      this.lastname = response.details[0].lastname;
      this.phone = response.details[0].phone;
      this.email = response.details[0].email;
      this.usertype = response.details[0].usertype;
    });
  }

  onSubmit(form: NgForm): void {
    const payload = {...form.value};
    if (payload.password === '') {
      delete payload.password;
    }
    this.appHttpService.editUser(this.selectedUser, payload).subscribe(response => {
      this.appService.showSnackBar(response.message);
      form.resetForm();
      this.resetUserSelection();
      this.getUsers();
    });
  }

  preValidateEmail(email: string): void {
    this.appHttpService.preValidateEmailEdit(this.selectedUser, email).subscribe(response => {
    }, error => {
      if (error.error.message !== 'Invalid field values') {
        this.email = '';
      }
    });
  }
}
