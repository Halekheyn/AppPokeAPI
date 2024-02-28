import { Injectable } from "@angular/core";
import { PokeApiManagerService } from './poke-api-manager.service';
import { PokemonDataPaginationInterface } from "../interfaces/pokemon-data-pagination.interface";
import { PokemonSearchTermsInterface } from "../interfaces/pokemon-search-terms.interface";


@Injectable({
  providedIn: 'root'
})
export class PokeApiPaginationService{

  constructor( private _pokeApiManagerService: PokeApiManagerService){}

  pokemonPagination(paginationData: PokemonDataPaginationInterface, searchTerms: PokemonSearchTermsInterface): PokemonDataPaginationInterface {

    console.log('pokemonPagination', {paginationData}, {searchTerms});
    const data = this._pokeApiManagerService.pokemonData;

    paginationData.pageItemInit = (paginationData.pageSize * (paginationData.pageCurrent - 1));
    const pageItemEnd = paginationData.pageItemInit + paginationData.pageSize;

    if(data.length > 0){

      /**
       *  Se comprueba si al menos un elemento del array
       * cumple con la condición especificada en la función proporcionada
       */
      const filterFlag = Object.keys(searchTerms).some((key) => {
        const valor = searchTerms[key as keyof PokemonSearchTermsInterface];
        // Verifica si el valor es distinto de null, undefined y no es una cadena vacía
        return valor !== null && valor !== undefined && valor !== '';
      });

      if(!filterFlag){

        paginationData.pageData = data.slice(paginationData.pageItemInit, pageItemEnd);
        paginationData.pageTotal = data.length;

      } else {

        const matchingItems = data.filter(pokemon =>
          Object.keys(searchTerms).every(key => {
            const pokemonData = (pokemon![key as keyof PokemonSearchTermsInterface] as string).toString().toLowerCase();
            const criteria = (searchTerms![key as keyof PokemonSearchTermsInterface] as string).toLowerCase();
            return pokemonData.includes(criteria);
          })
        );

        paginationData.pageTotal = matchingItems.length;

        if(paginationData.pageTotal > 0 ){
          paginationData.pageData = matchingItems.slice(paginationData.pageItemInit, pageItemEnd);
        }else{
          paginationData.pageData = [];
        }
      }
    }

    return paginationData;
	}
}
