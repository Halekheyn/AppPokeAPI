import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, of, tap } from "rxjs";

import { PokemonTable } from "../interfaces/pokemon-table.interface";


@Injectable({
  providedIn: 'root'
})
export class CrudService{

  private url_api: string = "https://pokeapi.co/api/v2/ability"

  constructor(private httpClient: HttpClient){}

  getPokemonList( limit:number, offset:number): Observable<PokemonTable | null>{

    const url: string = `${ this.url_api }/?limit=${ limit }&offset=${ offset }`;

    return this.getPokemonRequest(url);
  }

  private getPokemonRequest( url:string ):Observable<PokemonTable | null> {
    console.log('url', url);

    return this.httpClient.get<PokemonTable>(url)
               .pipe(
                  tap( ({ count, next, previous }) => console.log(count, next, previous)),
                  catchError(error => {
                    console.error('getPokemonRequest - catchError', error);
                    return of(null);
                  })
               )
  }
}
