import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PdfIframeComponent } from './pdf-iframe.component';

describe('PdfIframeComponent', () => {
  let component: PdfIframeComponent;
  let fixture: ComponentFixture<PdfIframeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PdfIframeComponent]
    });
    fixture = TestBed.createComponent(PdfIframeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
