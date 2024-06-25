import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListaDatosContracargoComponent } from './lista-datos-contracargo.component';

describe('ListaDatosContracargoComponent', () => {
  let component: ListaDatosContracargoComponent;
  let fixture: ComponentFixture<ListaDatosContracargoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ListaDatosContracargoComponent]
    });
    fixture = TestBed.createComponent(ListaDatosContracargoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
