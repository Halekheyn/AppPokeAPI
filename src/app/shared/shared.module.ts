import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PaginationLimitSelectorComponent } from './components/pagination-limit-selector/pagination-limit-selector.component';


@NgModule({
  declarations: [
    PaginationLimitSelectorComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    PaginationLimitSelectorComponent
  ]
})
export class SharedModule { }
