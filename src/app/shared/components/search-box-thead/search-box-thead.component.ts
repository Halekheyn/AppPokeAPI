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
      this.searchTerm.emit(value)
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
