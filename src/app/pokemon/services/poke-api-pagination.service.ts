import { Injectable } from "@angular/core";
import { PokeApiManagerService } from './poke-api-manager.service';
import { PokemonDataPaginationInterface } from "../interfaces/pokemon-data-pagination.interface";


@Injectable({
  providedIn: 'root'
})
export class PokeApiPaginationService{

  constructor( private _pokeApiManagerService: PokeApiManagerService){}

  pokemonPagination(paginationData: PokemonDataPaginationInterface, filterName: string = ''): PokemonDataPaginationInterface {

    console.log('pokemonPagination', {paginationData});
    const data = this._pokeApiManagerService.pokemonData;

    paginationData.pageItemInit = (paginationData.pageSize * (paginationData.pageCurrent - 1));
    const pageItemEnd = paginationData.pageItemInit + paginationData.pageSize;

    if(data.length > 0){

      if(filterName === ''){

        paginationData.pageData = data.slice(paginationData.pageItemInit, pageItemEnd);
        paginationData.pageTotal = data.length;

      } else {

          let filters = data.filter(pokemon => pokemon!.name.includes(filterName));
          paginationData.pageTotal = filters.length;

          if(paginationData.pageTotal > 0 ){
            paginationData.pageData = filters.slice(paginationData.pageItemInit, pageItemEnd);
        }
      }
    }

    return paginationData;
	}

}
