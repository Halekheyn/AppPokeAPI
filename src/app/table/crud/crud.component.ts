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

  public pageCurrent: number = 1;
	public pageLimit: number = 10;
	public pageOffset: number = 0;
	public pageTotal: number = 0;


  constructor(private _crudService:CrudService ){}

  ngOnInit(): void {

    this.pokemonList(this.pageLimit, this.pageOffset);
  }

  public pokemonList( limit:number, offset:number ){
    this._crudService.getPokemonList(limit, offset)
        .subscribe( pokemons => {

          if(pokemons?.results){
            this.pokemonData = pokemons.results.map(pokemon => ({ ...pokemon, onEdition: false }))
            this.pageTotal = pokemons.count;
          }else{
            this.pokemonData = [];
          }
        })
  }

  public pokemonDetail(index: number){
    console.log('pokemonDetail', index);

  }

  public pokemonEdit(index: number){
    console.log('pokemonEdit', index);

  }

  public pokemonDelete(index: number){
    console.log('pokemonDelete', index);

  }

  public pokemonCreate(index: number){
    console.log('pokemonCreate', index);

  }

  public pokemonCancel(index: number){
    console.log('pokemonCancel', index);

  }

  pokemonPagination() {
		console.log(this.pageCurrent);
    this.pageOffset = (this.pageLimit * (this.pageCurrent - 1));
    this.pokemonList(this.pageLimit, this.pageOffset);
	}
}
