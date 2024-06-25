import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalGestionConfigComponent } from './modal-gestion-config.component';

describe('ModalGestionConfigComponent', () => {
  let component: ModalGestionConfigComponent;
  let fixture: ComponentFixture<ModalGestionConfigComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ModalGestionConfigComponent]
    });
    fixture = TestBed.createComponent(ModalGestionConfigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
