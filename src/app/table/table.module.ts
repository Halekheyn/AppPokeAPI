import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TableRoutingModule } from './table-routing.module';
import { CrudComponent } from './crud/crud.component';


@NgModule({
  declarations: [
    CrudComponent
  ],
  imports: [
    CommonModule,
    TableRoutingModule
  ],
  exports:[
    CrudComponent
  ]
})
export class TableModule { }
