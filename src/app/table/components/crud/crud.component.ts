import { Component, OnInit, TemplateRef, QueryList, ViewChildren  } from '@angular/core';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgModel } from '@angular/forms';
import { Subject, Subscription, debounceTime } from 'rxjs';

import { CrudService } from './crud.service';

import { PokemonTable } from '../../interfaces/pokemon-table.interface';
import { PokemonInfoInterface } from '../../interfaces/pokemon-info.interface';


@Component({
  selector: 'table-crud',
  templateUrl: './crud.component.html',
  styleUrls: ['./crud.component.scss']
})
export class CrudComponent implements OnInit {

  // Data Pokémon
  public pokemonData: ( PokemonInfoInterface | null )[] = [];
  public pokemonDataEdit : ( PokemonInfoInterface | null )[] = [];
  public pokemonInfo: PokemonInfoInterface | null = null;

  // Paginación
  public pageCurrent: number = 1;
	public pageLimit: number = 10;
	public pageOffset: number = 0;
	public pageTotal: number = 0;

  //Modal
  public closeResult:string = '';

  // Nuevos Pokemon
  public pokemonRegister: PokemonTable[] = [];
  public standardTpl?: TemplateRef<any>;

  @ViewChildren('nameField') nameFields?: QueryList<NgModel>;
  @ViewChildren('imageField') imageFields?: QueryList<NgModel>;
  @ViewChildren('heightField') heightFields?: QueryList<NgModel>;
  @ViewChildren('weightField') weightFields?: QueryList<NgModel>;
  @ViewChildren('weightField') abilitiesFields?: QueryList<NgModel>;

  // Buscar
  public searchName: boolean = false;
  public filterName: string = '';
  private debouncerSearch: Subject<string> = new Subject<string>();
  private debouncerSearchSubscription?: Subscription;
  public pokemonsFilters: ( PokemonInfoInterface | null )[]  = [];

  constructor(private _crudService:CrudService,
              private ngbModal: NgbModal ){}

  ngOnInit(): void {
    this.pokemonPagination();

    this.debouncerSearchSubscription = this.debouncerSearch
      .pipe(
        debounceTime(1500)
      )
      .subscribe( filterName => {
        this.filterName = filterName;
        this.pageCurrent = 1;
        this.pokemonPagination();
      });
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

    console.log('pokemonPagination', this.filterName);

    console.log(this.pageCurrent);
    this.pageOffset = (this.pageLimit * (this.pageCurrent - 1));

    if(!this.filterName){

      const data = this._crudService.pokemonData;
      if(data !== null){
        const endIndex = this.pageOffset + this.pageLimit;
        this.pokemonData = data.slice(this.pageOffset, endIndex);
        this.pageTotal = this._crudService.pokemonData.length;
      }
    }else{
        console.log('ingreso');

        let filters = this._crudService.pokemonData.filter(pokemon => pokemon!.name.includes(this.filterName));
        console.log('filters', filters)

        if(filters !== null){
          const endIndex = this.pageOffset + this.pageLimit;
          this.pokemonData = filters.slice(this.pageOffset, endIndex);
          this.pageTotal = filters.length;
      }
    }
	}

  updateList(itemsLimit: string){
    this.pageCurrent = 1;
    this.pageLimit = parseInt(itemsLimit);
    this.pokemonPagination();
  }

  public pokemonDetail(id: number, content: TemplateRef<any>){
    console.log('pokemonDetail', id);

    this.pokemonInfo = this.pokemonData.filter(pokemon => pokemon!.id === id)[0];
    this.ngbModal.open(content, { ariaLabelledBy: 'modal-basic-title' })
            .result.then(
              (result) => {
                  this.closeResult = `Closed with: ${result}`;
                },
              (reason) => {
                this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
                },
        );
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

  agregarFila() {
    this.pokemonRegister.push({ id: null,
                                name: '',
                                urlImage: '',
                                height: '',
                                weight: '',
                                abilities: [] });
  }

  guardarRegistro(index: number){

    console.log(index);

    const nameField = this.nameFields?.toArray()[index];
    const imageField = this.imageFields?.toArray()[index];
    const heightField = this.heightFields?.toArray()[index];
    const weightField = this.weightFields?.toArray()[index];
    const abilitiesField = this.abilitiesFields?.toArray()[index];

    nameField?.control.markAsUntouched();
    imageField?.control.markAsUntouched();
    heightField?.control.markAsUntouched();
    weightField?.control.markAsUntouched();
    abilitiesField?.control.markAsUntouched();

    if (!this.pokemonRegister[index].name){
      nameField?.control.markAsTouched(); return;
    } else if( !this.pokemonRegister[index].urlImage) {
      imageField?.control.markAsTouched(); return;
    } else if ( !this.pokemonRegister[index].height){
      heightField?.control.markAsTouched(); return;
    } else if (!this.pokemonRegister[index].weight){
      weightField?.control.markAsTouched(); return;
    } else if (!this.pokemonRegister[index].abilities.length) {
      abilitiesField?.control.markAsTouched(); return;
    }

    const pokemonDataStorage = localStorage.getItem('pokemonData');

    console.log('guardarRegistro', this.pokemonRegister[index]);

    if(pokemonDataStorage){

      let pokemonStorage: PokemonInfoInterface[] = JSON.parse(pokemonDataStorage);

      const pokemonLast = pokemonStorage.reduce((prev, current) => {
        return (prev.id > current.id) ? prev : current;
      });

      const idNew = pokemonLast.id + 1;

      const abilities = this.pokemonRegister[index].abilities
                          .map( (data, index) => {
                            return {
                              is_hidden: false,
                              slot: index,
                              ability:  {
                                          name: data.value,
                                          url: data.value
                                        }
                            }
                          });

      // Generated by https://quicktype.io
      const pokemonAdd : PokemonInfoInterface = {
        id: idNew,
        name: this.pokemonRegister[index].name,
        base_experience: 0,
        height: parseInt(this.pokemonRegister[index].height),
        order: idNew,
        weight: parseInt(this.pokemonRegister[index].weight),
        abilities: abilities,
        sprites: {
                  other: {
                    dream_world: {
                      front_default: this.pokemonRegister[index].urlImage,
                    }
                  }
                },
        onEdition: false
      };

      pokemonStorage.push(pokemonAdd);
      this._crudService.pokemonData.push(pokemonAdd);

      localStorage.setItem('pokemonData', JSON.stringify(pokemonStorage));

      this.pokemonRegister.splice(index, 1);

      console.log('guardarRegistro', pokemonAdd);

      this.pageCurrent = 1;
      this.pokemonPagination();
    }
  }

  cancelarRegistro(index: number){
    this.pokemonRegister.splice(index, 1);
  }

  searchNameStatus(){
    this.searchName = !this.searchName;
    this.filterName = '';
    this.pageCurrent = 1;
    this.pokemonPagination();
  }

  pokemonSearch(filterName: string){
    this.debouncerSearch.next(filterName);
  }
}
