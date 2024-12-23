import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
//import * as pdfjsLib from 'pdfjs-dist';


@Component({
  selector: 'app-pdf-view-widget',
  standalone: true,
  imports: [
    MatDialogModule
  ],
  templateUrl: './pdf-view-widget.component.html',
  styleUrl: './pdf-view-widget.component.scss'
})
export class PdfViewWidgetComponent {
  pdfUrl: SafeResourceUrl;
  fileName: string;

  constructor(
    public dialogRef: MatDialogRef<PdfViewWidgetComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { url: string },
    private sanitizer: DomSanitizer
  ) {
    // Marca la URL como segura
    this.pdfUrl = this.sanitizer.bypassSecurityTrustResourceUrl(data.url);
    
    // Extrae el nombre del archivo de la URL
    this.fileName = this.extractFileName(data.url);
  }

  extractFileName(url: string): string {
    // Decodifica la URL y extrae el nombre del archivo
    const decodedUrl = decodeURIComponent(url);
    const parts = decodedUrl.split('/');
    const file = parts[parts.length - 1]; // Obtiene el último elemento, que es el nombre del archivo
    return file;
  }
  downloadPdf() {
    
    let link = document.createElement('a');
    link.href = this.pdfUrl.toString(); // URL del PDF
    link.download = this.fileName; // Nombre del archivo extraído
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
  onClose(): void {
    this.dialogRef.close();
  }

}
