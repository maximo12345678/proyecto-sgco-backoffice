import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VisualizadorEvidenciaComponent } from './visualizador-evidencia.component';

describe('VisualizadorEvidenciaComponent', () => {
  let component: VisualizadorEvidenciaComponent;
  let fixture: ComponentFixture<VisualizadorEvidenciaComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [VisualizadorEvidenciaComponent]
    });
    fixture = TestBed.createComponent(VisualizadorEvidenciaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
