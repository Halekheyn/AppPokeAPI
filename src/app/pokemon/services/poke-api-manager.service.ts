import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, of, tap, forkJoin, filter, map } from "rxjs";

import { PokemonDataFullInterface } from "../interfaces/pokemon-data-full.interface";
import { PokemonDataForTableInterface } from "../interfaces/pokemon-data-for-table.interface";


@Injectable({
  providedIn: 'root'
})
export class PokeApiManagerService{

  private url_api: string = "https://pokeapi.co/api/v2"

  public pokemonData: (PokemonDataForTableInterface | null)[] = [];

  constructor(private httpClient: HttpClient){
    this.pokemonDataInit();
  }

  private pokemonDataInit(){

    const pokemonList = localStorage.getItem('pokemonData');

    if( pokemonList){
      this.pokemonData = JSON.parse(pokemonList);
      return;
    }

    let getPokemonUrls = [];
    for(let i = 1; i <= 151; i++){
      getPokemonUrls.push(`${this.url_api}/pokemon/${i}/`);
    }

    const requests = getPokemonUrls.map(url => {
                          return this.getPokemonRequest(url)
                                     .pipe(
                                        filter((data): data is PokemonDataFullInterface => data !== null && (data as PokemonDataFullInterface).id !== undefined), // Asegura que data no es null y tiene propiedad id
                                        map(data => this.extractPokemonData(data))
                                     )
                     });

    forkJoin(requests).subscribe(responses => {
      console.log('pokemonDataInit', responses);
      localStorage.setItem('pokemonData', JSON.stringify( responses ));
      this.pokemonData = responses;
    })
  }

  private getPokemonRequest( url:string ): Observable< PokemonDataFullInterface | null > {
    console.log('url', url);

    return this.httpClient.get< PokemonDataFullInterface >(url)
               .pipe(
                  tap( (data) => console.log('getPokemonRequest - success', data)),
                  catchError(error => {
                    console.error('getPokemonRequest - catchError', error);
                    return of(null);
                  })
               )
  }

  private extractPokemonData(originalData: PokemonDataFullInterface): PokemonDataForTableInterface {
    const extractedData: PokemonDataForTableInterface = {
          id: originalData.id,
          name: originalData.name,
          base_experience: originalData.base_experience,
          height: originalData.height,
          order: originalData.order,
          weight: originalData.weight,
          abilities: originalData.abilities.map((ability: any) => ({
            is_hidden: ability.is_hidden,
            slot: ability.slot,
            ability: {
              name: ability.ability.name,
              url: ability.ability.url,
            },
          })),
          sprites: {
            other: {
              dream_world: {
                front_default: originalData.sprites.other!.dream_world!.front_default,
              },
            },
          },
          onEdition: false
        };

    return extractedData;
  }
}
