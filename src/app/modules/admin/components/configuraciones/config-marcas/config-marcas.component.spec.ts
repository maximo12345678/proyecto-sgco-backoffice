import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfigMarcasComponent } from './config-marcas.component';

describe('ConfigVisaComponent', () => {
  let component: ConfigMarcasComponent;
  let fixture: ComponentFixture<ConfigMarcasComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ConfigMarcasComponent]
    });
    fixture = TestBed.createComponent(ConfigMarcasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
