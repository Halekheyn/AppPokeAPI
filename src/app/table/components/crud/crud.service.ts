import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, of, tap, forkJoin, filter, map } from "rxjs";

import { PokemonTable } from "../../interfaces/pokemon-table.interface";
import { PokemonInfo } from "../../interfaces/pokemo-ability.interface";
import { PokemonDataInterface } from "../../interfaces/pokemon-data.interface";
import { PokemonInfoInterface } from "../../interfaces/pokemon-info.interface";


@Injectable({
  providedIn: 'root'
})
export class CrudService{

  private url_api: string = "https://pokeapi.co/api/v2"

  public pokemonData: (PokemonInfoInterface | null)[] = [];

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
                                        filter((data): data is PokemonDataInterface => data !== null && (data as PokemonDataInterface).id !== undefined), // Asegura que data no es null y tiene propiedad id
                                        map(data => this.extractPokemonData(data))
                                     )
                     });

    forkJoin(requests).subscribe(responses => {
      console.log('pokemonDataInit', responses);
      localStorage.setItem('pokemonData', JSON.stringify( responses ));
      this.pokemonData = responses;
    })
  }

  //this.pokemonDataStorage = JSON.parse( localStorage.getItem('pokemonDataStorage')! )

  /*getPokemonList( limit:number, offset:number): Observable<PokemonTable | null>{

    const url: string = `${ this.url_api }/?limit=${ limit }&offset=${ offset }`;

    return this.getPokemonRequest(url) as Observable<PokemonTable | null>;
  }*/

  getPokemonInfo( url: string ): Observable<PokemonInfo | null>{

    return this.getPokemonRequest(url) as Observable<PokemonInfo | null>;
  }

  private getPokemonRequest( url:string ): Observable<PokemonTable | PokemonInfo | PokemonDataInterface | null> {
    console.log('url', url);

    return this.httpClient.get<PokemonTable | PokemonInfo>(url)
               .pipe(
                  tap( (data) => console.log('getPokemonRequest - success', data)),
                  catchError(error => {
                    console.error('getPokemonRequest - catchError', error);
                    return of(null);
                  })
               )
  }

  private extractPokemonData(originalData: PokemonDataInterface): PokemonInfoInterface {
    const extractedData: PokemonInfoInterface = {
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
