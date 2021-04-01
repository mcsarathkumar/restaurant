import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageRestaurantAdminComponent } from './manage-restaurant-admin.component';

describe('ManageRestaurantAdminComponent', () => {
  let component: ManageRestaurantAdminComponent;
  let fixture: ComponentFixture<ManageRestaurantAdminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManageRestaurantAdminComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageRestaurantAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
