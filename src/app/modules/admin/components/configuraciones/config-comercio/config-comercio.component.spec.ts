import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfigComercioComponent } from './config-comercio.component';

describe('ConfigComercioComponent', () => {
  let component: ConfigComercioComponent;
  let fixture: ComponentFixture<ConfigComercioComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ConfigComercioComponent]
    });
    fixture = TestBed.createComponent(ConfigComercioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
