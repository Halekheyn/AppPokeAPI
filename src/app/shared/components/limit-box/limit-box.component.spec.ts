import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LimitBoxComponent } from './limit-box.component';

describe('LimitBoxComponent', () => {
  let component: LimitBoxComponent;
  let fixture: ComponentFixture<LimitBoxComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LimitBoxComponent]
    });
    fixture = TestBed.createComponent(LimitBoxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
