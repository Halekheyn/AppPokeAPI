import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { PokemonRoutingModule } from './pokemon-routing.module';
import { TagInputModule } from 'ngx-chips';

import { PokeApiManagerComponent } from './components/pokeApiManager/poke-api-manager.component';
import { SharedModule } from '../shared/shared.module';


@NgModule({
  declarations: [
    PokeApiManagerComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    NgbPaginationModule,
    PokemonRoutingModule,
    SharedModule,
    TagInputModule
  ],
  exports:[
    PokeApiManagerComponent
  ]
})
export class PokemonModule { }
