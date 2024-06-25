import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FiltrosMotivoComponent } from './filtros-motivo.component';

describe('FiltrosCbkComponent', () => {
  let component: FiltrosMotivoComponent;
  let fixture: ComponentFixture<FiltrosMotivoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FiltrosMotivoComponent]
    });
    fixture = TestBed.createComponent(FiltrosMotivoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
