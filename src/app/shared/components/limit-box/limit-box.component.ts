import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Subject, Subscription, debounceTime } from 'rxjs';

@Component({
  selector: 'limit-box',
  templateUrl: './limit-box.component.html',
  styleUrls: ['./limit-box.component.scss']
})
export class LimitBoxComponent implements OnInit{

  private debouncer: Subject<string> = new Subject<string>();
  private debouncerSubscription?: Subscription;

  @Output()
  public itemsList: EventEmitter<string>= new EventEmitter()

  ngOnInit(): void {
    this.debouncerSubscription = this.debouncer
    .pipe(
      debounceTime(1500)
    )
    .subscribe( value => {
      console.log('debouncer value', value);
      this.itemsList.emit(value)
    })
  }

  // Se llama cuando la instancia es destruida,
  // cada vez que salgo de la página
  ngOnDestroy(): void {
    this.debouncerSubscription?.unsubscribe()
  }

  showList( items:string ){
    console.log({items});
    this.debouncer.next(items);
  }
}
