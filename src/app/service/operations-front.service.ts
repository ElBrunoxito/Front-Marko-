import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BehaviorSubject } from 'rxjs';
import { ErrorDialogComponent } from '../components/widgets/error-dialog/error-dialog.component';
import { DetailsProductAddOrEditComponent } from '../components/widgets/details-product-add-or-edit/details-product-add-or-edit.component';
import { UUID } from 'angular2-uuid';
import { PdfViewWidgetComponent } from '../components/widgets/pdf-view-widget/pdf-view-widget.component';
import { ErrorOptionsComponent } from '../components/widgets/error-options/error-options.component';

@Injectable({
  providedIn: 'root'
})
export class OperationsFrontService {

  private _loading = new BehaviorSubject<boolean>(false);  // Estado inicial en 'false'
  loading$ = this._loading.asObservable();  // Observable para suscribirse

  setLoading(isLoading: boolean) {
    this._loading.next(isLoading);  // Cambia el estado de 'loading'
  }
  constructor(
    private snackBar:MatSnackBar,
    private matDialog:MatDialog
  ) { }


  /////////////////////////////

  private barcode: string = '';
  private barcodeTimeout: any;

 handleKeyPress(event: KeyboardEvent, fun:Function) {
    clearTimeout(this.barcodeTimeout);

    if (event.key === 'Enter'/*&& */) {
      if (this.barcode.length >= 5) {
        // Puedes ajustar la longitud mínima a la que usen los códigos de barras
        fun(this.barcode)
        //this.openDialog(this.barcode);
      }
      this.barcode = ''; // Limpiar
    } else {
      this.barcode += event.key;
      this.barcodeTimeout = setTimeout(() => {
        this.barcode = ''; // Limpiar si no hay actividad por un tiempo.
      }, 300); // Intervalo entre entradas del lector
    }
  }




  public openSnackBar(message: string, action: string,duration:number): void {
    this.snackBar.open(message, action, {
      duration: duration, // Duración en milisegundos (3 segundos)
      horizontalPosition: 'center', // Posición horizontal: 'start', 'center', 'end', 'left', 'right'
      verticalPosition: 'bottom',   // Posición vertical: 'top', 'bottom'
    });
  }

  public openFieldErrorReload(fun:Function){

    const dialogRef = this.matDialog.open(ErrorDialogComponent, {
      disableClose:true,
      width: '250px',
      data: { 
        message: "No se ha podido cargar los datos" ,
        textButton:"Volver a cargar"
        
      },
    });

    dialogRef.afterClosed().subscribe((res)=>{
      if(res){
        fun();
      }
    })
  }

  public openFieldError(fun:Function, message:string){

    const dialogRef = this.matDialog.open(ErrorDialogComponent, {
      disableClose:true,
      width: '250px',
      data: { 
        message,
        textButton:"OK"

      },
    });

    dialogRef.afterClosed().subscribe((res)=>{
      if(res){
        fun;
      }
    })
  }

  public openFieldErrorWithOptions(title:string,message:string):Promise<boolean>{
    const dialogRef = this.matDialog.open(ErrorOptionsComponent, {
      width: '250px',
      data: { title, message },
    });
    return new Promise((resolve)=>{
      dialogRef.afterClosed().subscribe(result => {
        resolve(result)
      });
    })



  }


  openPdfViewer(url: string): void {
    this.matDialog.open(PdfViewWidgetComponent, {
      data: { url:url },
      width: '80%',
      height: '80%',
    });
  }





  generateUUID():UUID{
    return UUID.UUID();
  }

  formatDate(date: string | Date): string {
    let parsedDate: Date;

    // Verificar si la entrada es una cadena
    if (typeof date === 'string') {
        // Intenta crear un objeto Date a partir de la cadena
        parsedDate = new Date(date);
    } else {
        // Si ya es un objeto Date, lo usamos directamente
        parsedDate = date;
    }

    // Manejo de errores si la fecha no es válida
    if (isNaN(parsedDate.getTime())) {
        throw new Error('Fecha no válida');
    }

    const year = parsedDate.getFullYear();
    const month = (parsedDate.getMonth() + 1).toString().padStart(2, '0'); // Los meses van de 0-11
    const day = parsedDate.getDate().toString().padStart(2, '0');

    return `${year}-${month}-${day}`;
}

  
  formatFromDateString(dateString: string): Date {
    const [year, month, day] = dateString.split('-').map(Number); // Divide la cadena y convierte a números
    return new Date(year, month - 1, day); // Los meses en el objeto Date van de 0-11
  }


  formatDateTimeFromString(dateString: string | Date): string {
    const date = typeof dateString === 'string' ? new Date(dateString) : dateString;
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');

    return `${year}-${month}-${day} ${hours}:${minutes}`;
}


  
}
