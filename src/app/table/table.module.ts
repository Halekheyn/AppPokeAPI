import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { TableRoutingModule } from './table-routing.module';
import { TagInputModule } from 'ngx-chips';

import { CrudComponent } from './components/crud/crud.component';
import { SharedModule } from '../shared/shared.module';


@NgModule({
  declarations: [
    CrudComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    NgbPaginationModule,
    TableRoutingModule,
    SharedModule,
    TagInputModule
  ],
  exports:[
    CrudComponent
  ]
})
export class TableModule { }
