import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FiltrosCbkComponent } from './filtros-cbk.component';

describe('FiltrosCbkComponent', () => {
  let component: FiltrosCbkComponent;
  let fixture: ComponentFixture<FiltrosCbkComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FiltrosCbkComponent]
    });
    fixture = TestBed.createComponent(FiltrosCbkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
