import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MotivosAdminComponent } from './motivos-admin.component';

describe('MotivosAdminComponent', () => {
  let component: MotivosAdminComponent;
  let fixture: ComponentFixture<MotivosAdminComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MotivosAdminComponent]
    });
    fixture = TestBed.createComponent(MotivosAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
