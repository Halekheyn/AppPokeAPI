import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';


import { TableRoutingModule } from './table-routing.module';
import { CrudComponent } from './crud/crud.component';
import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';


@NgModule({
  declarations: [
    CrudComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    NgbPaginationModule,
    TableRoutingModule
  ],
  exports:[
    CrudComponent
  ]
})
export class TableModule { }
