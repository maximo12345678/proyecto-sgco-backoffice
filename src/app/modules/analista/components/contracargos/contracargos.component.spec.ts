import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContracargosComponent } from './contracargos.component';

describe('ContracargosComponent', () => {
  let component: ContracargosComponent;
  let fixture: ComponentFixture<ContracargosComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ContracargosComponent]
    });
    fixture = TestBed.createComponent(ContracargosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
