import { Component, Input } from '@angular/core';
import { SafeResourceUrl } from '@angular/platform-browser';
import { DocumentoGetEvidencia } from 'src/models/evidencia/GetEvidencia';

@Component({
  selector: 'app-visualizador-evidencia',
  templateUrl: './visualizador-evidencia.component.html',
  styleUrls: ['./visualizador-evidencia.component.css'],
})
export class VisualizadorEvidenciaComponent {
  @Input() imageSrc!: string;
  @Input() isLoading!: boolean;
  @Input() documents!: DocumentoGetEvidencia[];

  currentDocIndex: number = 0;

  get doc() {
    if (this.documents && this.documents.length > 0) {
      return this.documents[this.currentDocIndex];
    }
    return null;
  }

  get currentDocIsPDF() {
    if (this.doc && this.doc.file_type.toLowerCase() === 'pdf') {
      return true;
    }
    return false;
  }

  get nDocs() {
    if (!this.documents) {
      return 0;
    }
    return this.documents.length;
  }

  get leftButtonDisabled() {
    return this.currentDocIndex === 0;
  }

  get rightButtonDisabled() {
    return this.currentDocIndex === this.nDocs - 1;
  }

  get evidenceNavigatorSpan() {
    return `(${this.currentDocIndex + 1} de ${this.nDocs})`;
  }

  getImgSrc(doc: DocumentoGetEvidencia): SafeResourceUrl {
    return `data:image/${doc.file_type};base64,` + doc.file_data;
  }

  showNextDoc(): void {
    if (!this.rightButtonDisabled) {
      this.currentDocIndex++;
    }
  }

  showPrevDoc(): void {
    if (!this.leftButtonDisabled) {
      this.currentDocIndex--;
    }
  }

  getCurrentDoc(): DocumentoGetEvidencia {
    return this.documents[this.currentDocIndex];
  }

  hasNextDoc(): boolean {
    return this.currentDocIndex < this.documents.length - 1;
  }

  hasPrevDoc(): boolean {
    return this.currentDocIndex > 0;
  }
}
