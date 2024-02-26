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
  public pokemonDataEdit : ( PokemonData | null )[] = [];
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

  public pokemonDetail(url: string, content: TemplateRef<any>){
    console.log('pokemonDetail', url);

    this._crudService.getPokemonInfo(url)
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
        })

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

  public pokemonEdit(index: number){
    /*console.log('pokemonEdit', index);
    this.pokemonData[index].onEdition = true;
    this.pokemonDataEdit[index] = { ...this.pokemonData[index] }
    console.table(this.pokemonDataEdit);*/
  }

  public pokemonDelete(index: number){
    console.log('pokemonDelete', index);
    this.pokemonDataEdit.splice(index,1);
    this.pokemonData.splice(index,1);
  }

  public pokemonCreate(index: number){
    /*console.log('pokemonCreate', index);
    this.pokemonData[index].onEdition = false;
    this.pokemonDataEdit[index] = null;
    console.table(this.pokemonDataEdit);*/
  }

  public pokemonCancel(index: number){
    /*console.log('pokemonCancel', index);
    this.pokemonData[index] = { ...this.pokemonDataEdit[index]! };
    this.pokemonData[index].onEdition = false;
    this.pokemonDataEdit[index] = null;
    console.table(this.pokemonDataEdit);*/
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
    /*this.pageCurrent = 1;
    this.pageLimit = parseInt(itemsLimit);
    this.pokemonPagination()*/
  }
}
