import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MenuConfigsComponent } from './menu-configs.component';

describe('MenuConfigsComponent', () => {
  let component: MenuConfigsComponent;
  let fixture: ComponentFixture<MenuConfigsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MenuConfigsComponent]
    });
    fixture = TestBed.createComponent(MenuConfigsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
