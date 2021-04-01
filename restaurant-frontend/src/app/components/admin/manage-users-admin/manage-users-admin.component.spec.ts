import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageUsersAdminComponent } from './manage-users-admin.component';

describe('ManageUsersAdminComponent', () => {
  let component: ManageUsersAdminComponent;
  let fixture: ComponentFixture<ManageUsersAdminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManageUsersAdminComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageUsersAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
