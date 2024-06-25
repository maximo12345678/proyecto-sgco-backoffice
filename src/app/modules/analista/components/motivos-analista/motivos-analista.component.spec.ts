import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MotivosAnalistaComponent } from './motivos-analista.component';

describe('MotivosComponent', () => {
  let component: MotivosAnalistaComponent;
  let fixture: ComponentFixture<MotivosAnalistaComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MotivosAnalistaComponent]
    });
    fixture = TestBed.createComponent(MotivosAnalistaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
