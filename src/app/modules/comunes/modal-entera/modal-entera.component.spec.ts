import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalEnteraComponent } from './modal-entera.component';

describe('ModalEnteraComponent', () => {
  let component: ModalEnteraComponent;
  let fixture: ComponentFixture<ModalEnteraComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ModalEnteraComponent]
    });
    fixture = TestBed.createComponent(ModalEnteraComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
