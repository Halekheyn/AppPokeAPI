import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PaginationLimitSelectorComponent } from './components/pagination-limit-selector/pagination-limit-selector.component';
import { SearchBoxTheadComponent } from './components/search-box-thead/search-box-thead.component';


@NgModule({
  declarations: [
    PaginationLimitSelectorComponent,
    SearchBoxTheadComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    PaginationLimitSelectorComponent,
    SearchBoxTheadComponent
  ]
})
export class SharedModule { }
