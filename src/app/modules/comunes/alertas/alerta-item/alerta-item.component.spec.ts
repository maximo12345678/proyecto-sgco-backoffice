import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AlertaItemComponent } from './alerta-item.component';

describe('AlertaItemComponent', () => {
  let component: AlertaItemComponent;
  let fixture: ComponentFixture<AlertaItemComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AlertaItemComponent]
    });
    fixture = TestBed.createComponent(AlertaItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
