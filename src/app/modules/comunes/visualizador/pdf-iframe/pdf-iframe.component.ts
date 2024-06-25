import { Component, Input, OnChanges } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-pdf-iframe',
  styleUrls: ['./pdf-iframe.component.css'],
  template: '<iframe [src]="pdfSrc" class="visualizador-pdf" title="Evidencia PDF"></iframe>',
})
export class PdfIframeComponent implements OnChanges {
  @Input() fileData!: string;
  pdfSrc: SafeResourceUrl = '';

  constructor(private sanitizer: DomSanitizer) {}

  ngOnChanges(): void {
    
    this.setPdfSrc();
  }

  private setPdfSrc(): void {
    const pdfDataUrl = 'data:application/pdf;base64,' + this.fileData;
    this.pdfSrc = this.sanitizer.bypassSecurityTrustResourceUrl(pdfDataUrl);
    
  }
}
