import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { Subject, Subscription, debounceTime } from 'rxjs';


@Component({
  selector: 'pagination-limit-selector',
  templateUrl: './pagination-limit-selector.component.html',
  styleUrls: ['./pagination-limit-selector.component.scss']
})
export class PaginationLimitSelectorComponent implements OnInit, OnDestroy{

  private recordsPerPageDebouncer: Subject<string> = new Subject<string>();
  private recordsPerPageDebouncerSubscription?: Subscription;

  @Output()
  public pageSize: EventEmitter<string>= new EventEmitter();

  ngOnInit(): void {

    /**
     * Esperar a que el usuario termine de escribir
     * antes de enviar al componente padre
     * el límite de registros a visualizar por paginación
     */
    this.recordsPerPageDebouncerSubscription = this.recordsPerPageDebouncer
    .pipe(
      debounceTime(1500)
    )
    .subscribe( value => {
      this.pageSize.emit(value)
    })
  }

  /**
   * Se implementa 'ngOnDestroy' para destruir la instancia
   * cada vez que se salga de la página
   */
  ngOnDestroy(): void {
    this.recordsPerPageDebouncerSubscription?.unsubscribe();
  }

  setPaginationLimit( items:string ){
    this.recordsPerPageDebouncer.next(items);
  }
}
