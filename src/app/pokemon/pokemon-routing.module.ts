import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PokeApiManagerComponent } from './components/pokeApiManager/poke-api-manager.component';

const routes: Routes = [
  {
    path: '',
    component: PokeApiManagerComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PokemonRoutingModule { }
