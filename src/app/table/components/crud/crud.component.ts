import { PokemonDataInterface } from './../../interfaces/pokemon-data.interface';
import { Component, OnInit, inject, TemplateRef } from '@angular/core';

import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { PokemonData } from '../../interfaces/pokemon-table.interface';
import { CrudService } from './crud.service';
import { PokemonInfo } from '../../interfaces/pokemo-ability.interface';
import { PokemonInfoInterface } from '../../interfaces/pokemon-info.interface';


@Component({
  selector: 'table-crud',
  templateUrl: './crud.component.html',
  styleUrls: ['./crud.component.scss']
})
export class CrudComponent implements OnInit {

  // Data Pokémon
  public pokemonData: (PokemonInfoInterface | null)[] = [];
  public pokemonDataEdit : ( PokemonInfoInterface | null )[] = [];
  public pokemonInfo: PokemonInfo | null = null;
  public test?: string = '';

  // Paginación
  public pageCurrent: number = 1;
	public pageLimit: number = 10;
	public pageOffset: number = 0;
	public pageTotal: number = 0;

  //Modal
  public closeResult:string = '';

  constructor(private _crudService:CrudService,
              private ngbModal: NgbModal ){}

  ngOnInit(): void {
    this.pokemonPagination()
  }

  public pokemonDetail(id: number, content: TemplateRef<any>){
    console.log('pokemonDetail', id);

    /*this._crudService.getPokemonInfo(url)
        .subscribe( pokemonInfo => {
          this.pokemonInfo = pokemonInfo;
          this.test =  pokemonInfo?.effect_entries.find(entry => entry.language.name === 'en')?.effect;
          this.ngbModal.open(content, { ariaLabelledBy: 'modal-basic-title' })
                 .result.then(
                    (result) => {
                        this.closeResult = `Closed with: ${result}`;
                      },
                    (reason) => {
                      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
                      },
              );
        })*/

  }

  private getDismissReason(reason: any): string {
		switch (reason) {
			case ModalDismissReasons.ESC:
				return 'by pressing ESC';
			case ModalDismissReasons.BACKDROP_CLICK:
				return 'by clicking on a backdrop';
			default:
				return `with: ${reason}`;
		}
	}

  public pokemonEdit(id: number){

    console.log('pokemonEdit', id);
    const pokemonItem = this.pokemonData.find(pokemon => pokemon!.id === id);

    if (pokemonItem) {
      this.pokemonDataEdit.push({ ...pokemonItem });
      pokemonItem.onEdition = true;
    }

    console.table(this.pokemonDataEdit);
  }

  public pokemonCancel(id: number){

    console.log('pokemonCancel', id);
    let pokemonReset = this.pokemonData.find(pokemon => pokemon!.id === id);
    const pokemonOriginal = this.pokemonDataEdit.find(pokemon => pokemon!.id === id);

    if (pokemonReset && pokemonOriginal) {
      Object.assign(pokemonReset, pokemonOriginal);
    }

    this.pokemonDataEdit = this.pokemonDataEdit.filter(pokemon => pokemon!.id !== id);

    console.table(this.pokemonDataEdit);
  }

  public pokemonUpdate(id: number){
    console.log('pokemonUpdate', id);

    let pokemonNewInfo = this.pokemonData.find(pokemon => pokemon!.id === id);
    const pokemonDataStorage = localStorage.getItem('pokemonData');

    if(pokemonNewInfo && pokemonDataStorage){
      pokemonNewInfo.onEdition = false;

      const pokemonStorage: PokemonInfoInterface[] = JSON.parse(pokemonDataStorage);
      const pokemonOldInfo = pokemonStorage.find(pokemon => pokemon.id === id);

      if (pokemonOldInfo) {
        Object.assign(pokemonOldInfo, pokemonNewInfo);
        localStorage.setItem('pokemonData', JSON.stringify(pokemonStorage));
      }
    }

    this.pokemonDataEdit = this.pokemonDataEdit.filter(pokemon => pokemon!.id !== id);
    console.table(this.pokemonDataEdit);
  }

  public pokemonDelete(id: number){

    const pokemonDataStorage = localStorage.getItem('pokemonData');

    if(pokemonDataStorage){

      const pokemonOldStorage: PokemonInfoInterface[] = JSON.parse(pokemonDataStorage);
      const pokemonNewStorage = pokemonOldStorage.filter(pokemon => pokemon.id !== id);
      console.log('ingreso', pokemonNewStorage);
      if (pokemonNewStorage) {
        this._crudService.pokemonData = pokemonNewStorage;
        localStorage.setItem('pokemonData', JSON.stringify(pokemonNewStorage));

        this._crudService.pokemonData = this._crudService.pokemonData.filter(pokemon => pokemon!.id !== id);

        if (this.pageCurrent > 1 && this.pageOffset >= this._crudService.pokemonData.length) {
          this.pageCurrent--;
        }

        this.pokemonPagination();
      }
    }
    console.table(this.pokemonDataEdit);
  }

  pokemonPagination() {

    console.log(this.pageCurrent);
    this.pageOffset = (this.pageLimit * (this.pageCurrent - 1));

    const data = this._crudService.pokemonData;
    if(data !== null){
      const endIndex = this.pageOffset + this.pageLimit;
      this.pokemonData = data.slice(this.pageOffset, endIndex);
      this.pageTotal = this._crudService.pokemonData.length;
    }
	}

  updateList(itemsLimit: string){
    this.pageCurrent = 1;
    this.pageLimit = parseInt(itemsLimit);
    this.pokemonPagination();
  }
}
