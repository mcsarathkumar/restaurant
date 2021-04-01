import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormsModule} from '@angular/forms';
import {APP_DATE_FORMATS, MaterialModule} from './material.module';
import {FlexLayoutModule} from '@angular/flex-layout';
import {environment} from '../environments/environment';
import {MAT_DATE_FORMATS} from '@angular/material/core';

@NgModule({
  declarations: [],
  imports: [],
  exports: [
    CommonModule,
    FormsModule,
    MaterialModule,
    FlexLayoutModule
  ],
  providers: [
    {provide: MAT_DATE_FORMATS, useValue: APP_DATE_FORMATS}
  ]
})
export class CustomCommonModule {
}
