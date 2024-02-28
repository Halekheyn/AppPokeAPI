import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { Subject, Subscription, debounceTime } from 'rxjs';

@Component({
  selector: 'search-box-thead',
  templateUrl: './search-box-thead.component.html',
  styleUrls: ['./search-box-thead.component.scss']
})
export class SearchBoxTheadComponent implements OnInit, OnDestroy{

  private searchTermDebouncer: Subject<string> = new Subject<string>();
  private searchTermDebouncerSubscription?: Subscription;

  @Input()
  public inputType!: string;

  @Input()
  public inputMaxLength!: string;

  @Output()
  public searchTerm: EventEmitter<string>= new EventEmitter();

  ngOnInit(): void {

    /**
     * Esperar a que el usuario termine de escribir
     * antes de enviar al componente padre el termino de búsqueda
     */
    this.searchTermDebouncerSubscription = this.searchTermDebouncer
    .pipe(
      debounceTime(1500)
    )
    .subscribe( value => {

      if(this.inputType === 'text'){
        this.searchTerm.emit(value);
      } else if(this.inputType === 'number' && parseInt(value) <= parseInt(this.inputMaxLength)){
        this.searchTerm.emit(value);
      } else {
        if(this.inputType === 'number'){
          console.error('No se logra enviar la petición, porque no cumple las condiciones', value);
        }
      }
    })
  }

  /**
   * Se implementa 'ngOnDestroy' para destruir la instancia
   * cada vez que se salga de la página
   */
  ngOnDestroy(): void {
    this.searchTermDebouncerSubscription?.unsubscribe();
  }

  setSearchTerm( searchTerm:string ){
    this.searchTermDebouncer.next(searchTerm);
  }
}
