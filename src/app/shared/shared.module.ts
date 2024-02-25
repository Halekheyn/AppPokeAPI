import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LimitBoxComponent } from './components/limit-box/limit-box.component';


@NgModule({
  declarations: [
    LimitBoxComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    LimitBoxComponent
  ]
})
export class SharedModule { }
