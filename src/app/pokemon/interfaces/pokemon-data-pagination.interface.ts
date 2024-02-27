import { PokemonDataForTableInterface } from './pokemon-data-for-table.interface';

export interface PokemonDataPaginationInterface {
  pageData: (PokemonDataForTableInterface | null)[];
  pageCurrent: number;
  pageSize: number;
  pageTotal:number;
  pageItemInit?:number;
}
