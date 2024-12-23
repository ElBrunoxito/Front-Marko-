import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { ErrorDTO } from '../models/Response';
//import { FirebaseStorage, Storage } from '@angular/fire/storage';

@Injectable({
  providedIn: 'root'
})
export class HttpService {

  constructor(private http:HttpClient,
    //private storageF:Storage

  ){}
    static handleError(error: HttpErrorResponse): Observable<never> {
        let errorMessage = 'Error desconocido';
        if (error.error instanceof Object && 'code' in error.error) {
          const errorDto: ErrorDTO<any> = error.error;
          errorMessage = `Error: ${errorDto.message} (Código: ${errorDto.code})`;
        } else if (error.status === 0) {
          errorMessage = 'No se puede conectar con el servidor.';
        } else {
          errorMessage = `Error en la solicitud. Código: ${error.status}`;
        }
        return throwError(() => new Error(errorMessage));
      }
    
 downloadPdf(fileUrl: string) {
  //const headers = { 'Accept': 'application/pdf' };
  /*this.http.get(url, { responseType: 'blob' }).subscribe(blob => {
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'pdf_T0001.pdf'; // Cambia el nombre del archivo si lo deseas
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url); // Limpia la URL después de la descarga
  }, error => {
    console.error('Error al descargar el PDF', error);
  });*/
  const decodedUrl = decodeURIComponent(fileUrl);

  // Extrae solo el nombre del archivo sin los parámetros de la URL
  const extractedFileName = decodedUrl.substring(decodedUrl.lastIndexOf('/') + 1).split('?')[0]; // pdf_1730529274502_T0003.pdf
  
  this.http.get(fileUrl, { responseType: 'blob' }).subscribe(blob => {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = extractedFileName; // Usa el nombre extraído
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url); // Limpia la URL después de la descarga
  }, error => {
      console.error('Error al descargar el PDF', error);
  });
 
}



private extractFileName(url: string): string {
  // Decodificar la URL para reemplazar %2F por '/'
  const decodedUrl = decodeURIComponent(url);

  // Usar una expresión regular para buscar el nombre de archivo con prefijo 'pdf_' y extensión '.pdf'
  const match = decodedUrl.match(/pdf_\d+_T\d+\.pdf/);

  // Si se encuentra una coincidencia, se devuelve como nombre de archivo; si no, se usa un nombre predeterminado
  return match ? match[0] : 'default_filename.pdf';
}
  
    

    
}
