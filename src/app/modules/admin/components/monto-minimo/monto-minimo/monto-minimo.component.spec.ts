import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MontoMinimoComponent } from './monto-minimo.component';

describe('MontoMinimoComponent', () => {
  let component: MontoMinimoComponent;
  let fixture: ComponentFixture<MontoMinimoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MontoMinimoComponent]
    });
    fixture = TestBed.createComponent(MontoMinimoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
