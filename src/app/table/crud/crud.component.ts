import { Component, OnInit } from '@angular/core';
import { PokemonData } from '../interfaces/pokemon-table.interface';
import { CrudService } from './crud.service';


@Component({
  selector: 'table-crud',
  templateUrl: './crud.component.html',
  styleUrls: ['./crud.component.scss']
})
export class CrudComponent implements OnInit {

  public pokemonData!: PokemonData[];


  constructor(private _crudService:CrudService ){}

  ngOnInit(): void {

    this.pokemonList(20,20);
  }

  public pokemonList( limit:number, offset:number ){
    this._crudService.getPokemonList(limit, offset)
        .subscribe( pokemons => {

          this.pokemonData = pokemons?.results ?? [];
        })
  }
}
