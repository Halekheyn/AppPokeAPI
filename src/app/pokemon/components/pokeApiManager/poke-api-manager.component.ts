import { Component, OnInit, TemplateRef, QueryList, ViewChildren  } from '@angular/core';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgModel } from '@angular/forms';
import { Subject, Subscription, debounceTime } from 'rxjs';

import { PokeApiManagerService } from '../../services/poke-api-manager.service';
import { PokeApiPaginationService } from '../../services/poke-api-pagination.service';

import { PokemonDataCreateInterface } from '../../interfaces/pokemon-data-create.interface';
import { PokemonDataForTableInterface } from '../../interfaces/pokemon-data-for-table.interface';
import { PokemonDataPaginationInterface } from '../../interfaces/pokemon-data-pagination.interface';


@Component({
  selector: 'poke-api-manager',
  templateUrl: './poke-api-manager.component.html',
  styleUrls: ['./poke-api-manager.component.scss']
})
export class PokeApiManagerComponent implements OnInit {

  // Data Pokémon
  public pokemonDataEdit : ( PokemonDataForTableInterface | null )[] = [];
  public pokemonInfo: PokemonDataForTableInterface | null = null;

  // Paginación
  public pokemonDataTable: PokemonDataPaginationInterface = {
    pageData: [],
    pageCurrent: 1,
    pageSize: 10,
    pageTotal: 0,
    pageItemInit: 0
  }

  //Modal
  public closeResult:string = '';

  // Nuevos Pokemon
  public pokemonRegister: PokemonDataCreateInterface[] = [];
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
  public pokemonsFilters: ( PokemonDataForTableInterface | null )[]  = [];

  constructor(private _pokeApiManagerService:PokeApiManagerService,
              private _pokeApiPaginationService: PokeApiPaginationService,
              private ngbModal: NgbModal ){}

  ngOnInit(): void {

    this.pokemonPagination();

    this.debouncerSearchSubscription = this.debouncerSearch
      .pipe(
        debounceTime(1500)
      )
      .subscribe( filterName => {
        this.filterName = filterName;
        this.pokemonDataTable.pageCurrent = 1;
        this.pokemonPagination();
      });
  }

  public pokemonEdit(id: number){

    console.log('pokemonEdit', id);
    const pokemonItem = this.pokemonDataTable.pageData.find(pokemon => pokemon!.id === id);

    if (pokemonItem) {
      this.pokemonDataEdit.push({ ...pokemonItem });
      pokemonItem.onEdition = true;
    }

    console.table(this.pokemonDataEdit);
  }

  public pokemonCancel(id: number){

    console.log('pokemonCancel', id);
    let pokemonReset = this.pokemonDataTable.pageData.find(pokemon => pokemon!.id === id);
    const pokemonOriginal = this.pokemonDataEdit.find(pokemon => pokemon!.id === id);

    if (pokemonReset && pokemonOriginal) {
      Object.assign(pokemonReset, pokemonOriginal);
    }

    this.pokemonDataEdit = this.pokemonDataEdit.filter(pokemon => pokemon!.id !== id);

    console.table(this.pokemonDataEdit);
  }

  public pokemonUpdate(id: number){
    console.log('pokemonUpdate', id);

    let pokemonNewInfo = this.pokemonDataTable.pageData.find(pokemon => pokemon!.id === id);
    const pokemonDataStorage = localStorage.getItem('pokemonData');

    if(pokemonNewInfo && pokemonDataStorage){
      pokemonNewInfo.onEdition = false;

      const pokemonStorage: PokemonDataForTableInterface[] = JSON.parse(pokemonDataStorage);
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

      const pokemonOldStorage: PokemonDataForTableInterface[] = JSON.parse(pokemonDataStorage);
      const pokemonNewStorage = pokemonOldStorage.filter(pokemon => pokemon.id !== id);
      console.log('ingreso', pokemonNewStorage);
      if (pokemonNewStorage) {
        this._pokeApiManagerService.pokemonData = pokemonNewStorage;
        localStorage.setItem('pokemonData', JSON.stringify(pokemonNewStorage));

        this._pokeApiManagerService.pokemonData = this._pokeApiManagerService.pokemonData.filter(pokemon => pokemon!.id !== id);

        if (this.pokemonDataTable.pageCurrent > 1 && this.pokemonDataTable.pageSize >= this.pokemonDataTable.pageTotal) {
          this.pokemonDataTable.pageCurrent --;
        }

        this.pokemonPagination();
      }
    }
    console.table(this.pokemonDataEdit);
  }

  updateList(itemsLimit: string){
    this.pokemonDataTable.pageCurrent = 1;
    this.pokemonDataTable.pageSize = parseInt(itemsLimit);
    this.pokemonPagination();
  }

  public pokemonDetail(id: number, content: TemplateRef<any>){
    console.log('pokemonDetail', id);

    this.pokemonInfo = this.pokemonDataTable.pageData.filter(pokemon => pokemon!.id === id)[0];
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

      let pokemonStorage: PokemonDataForTableInterface[] = JSON.parse(pokemonDataStorage);

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

      const pokemonAdd : PokemonDataForTableInterface = {
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
      this._pokeApiManagerService.pokemonData.push(pokemonAdd);

      localStorage.setItem('pokemonData', JSON.stringify(pokemonStorage));

      this.pokemonRegister.splice(index, 1);

      console.log('guardarRegistro', pokemonAdd);

      this.pokemonDataTable.pageCurrent = 1;
      this.pokemonPagination();
    }
  }

  cancelarRegistro(index: number){
    this.pokemonRegister.splice(index, 1);
  }

  searchNameStatus(){
    this.searchName = !this.searchName;
    this.filterName = '';
    this.pokemonDataTable.pageCurrent = 1;
  }

  pokemonSearch(filterName: string){
    this.debouncerSearch.next(filterName);
  }

  pokemonPagination(){
    this.pokemonDataTable = this._pokeApiPaginationService.pokemonPagination(this.pokemonDataTable, this.filterName);
  }
}
