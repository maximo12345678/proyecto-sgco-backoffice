import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListaDesplegableComponent } from './lista-desplegable.component';

describe('ListaDesplegableComponent', () => {
  let component: ListaDesplegableComponent;
  let fixture: ComponentFixture<ListaDesplegableComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ListaDesplegableComponent]
    });
    fixture = TestBed.createComponent(ListaDesplegableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
