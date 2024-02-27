import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaginationLimitSelectorComponent } from './pagination-limit-selector.component';

describe('LimitBoxComponent', () => {
  let component: PaginationLimitSelectorComponent;
  let fixture: ComponentFixture<PaginationLimitSelectorComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PaginationLimitSelectorComponent]
    });
    fixture = TestBed.createComponent(PaginationLimitSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
