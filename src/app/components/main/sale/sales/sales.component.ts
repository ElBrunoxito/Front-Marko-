import { Component, ViewChild } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { SaleGetDTO } from '../../../../models/Sale';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { SaleService } from '../../../../service/sale.service';
import { OperationsFrontService } from '../../../../service/operations-front.service';
import { Router, RouterLink } from '@angular/router';
import { ErrorDialogComponent } from '../../../widgets/error-dialog/error-dialog.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { ButtonModule } from 'primeng/button';
import { MatIcon } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { HttpService } from '../../../../service/http.service';

@Component({
    selector: 'app-sales',
    imports: [
        MatFormFieldModule,
        MatTableModule,
        MatPaginatorModule,
        MatButtonModule,
        ButtonModule,
        MatIcon,
        RouterLink,
        FormsModule,
    ],
    templateUrl: './sales.component.html',
    styleUrl: './sales.component.scss'
})
export class SalesComponent {
  displayedColumns: string[] = ['fec','code','sub','des','total','cobrado','tipo','user','act']

  dataSource = new MatTableDataSource<SaleGetDTO>([]);
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  public buscar :any = ""




  constructor(
    public matDialog: MatDialog,
    private saleService:SaleService,
    public helping: OperationsFrontService,
    private router:Router,
    private httpService:HttpService
  ) {


  }



  ngOnInit(): void {
    this.getAllSales();
    this.initf();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator
  }

  getAllSales(){
    this.helping.setLoading(true)
    this.saleService.getAll().subscribe({
      next:(res)=>{
        this.dataSource = new MatTableDataSource<SaleGetDTO>(res);
        this.dataSource.paginator = this.paginator;
        this.helping.setLoading(false)
      },
      error:(err)=>{
        this.helping.setLoading(false)

        this.helping.openFieldErrorReload(()=>{
          this.getAllSales()
        })

      },


    })
  
  } 





  startDate: Date = new Date(); // Fecha de inicio, por defecto hoy
  endDate: Date = new Date();

  applyFilterDate(){
    // const start = this.startDate ? new Date(this.startDate) : null;
    // const end = this.endDate ? new Date(this.endDate) : null;

    // // Filtra los datos en dataSource usando el rango de fechas
    // this.dataSource.filterPredicate = (data: SaleGetDTO, filter: string) => {
    //   const saleDate = new Date(data.saleUpdateDate);
      
    //   // Verifica si la fecha está dentro del rango
    //   const matchesStart = start ? saleDate >= start : true;
    //   const matchesEnd = end ? saleDate <= end : true;

    //   return matchesStart && matchesEnd;
    // };

    // // Forzar la actualización del filtro
    // this.dataSource.filter = '' + Math.random(); 

    console.warn("inciial inciial: "  + this.startDate)
    console.warn("inciial finall: "  + this.endDate)

    const startDateInput = this.startDate; // Formato: YYYY-MM-DD
  const endDateInput = this.endDate; // Formato: YYYY-MM-DD

  // Ajusta la fecha de inicio al inicio del día (00:00:00)
  const start = startDateInput ? new Date(startDateInput + 'T00:00:00') : null;

  // Ajusta la fecha de fin al final del día (23:59:59)
  const end = endDateInput ? new Date(endDateInput + 'T23:59:59') : null;

  // Imprime las fechas en la consola para verificar
  console.log('Start Date:', start);
  console.log('End Date:', end);

  // Filtros de la dataSource
  this.dataSource.filterPredicate = (data: SaleGetDTO, filter: string) => {
    const saleDate = new Date(data.saleUpdateDate);

    // Compara las fechas en milisegundos
    const matchesStart = start ? saleDate.getTime() >= start.getTime() : true;
    const matchesEnd = end ? saleDate.getTime() <= end.getTime() : true;

    return matchesStart && matchesEnd;
  };

  // Forzar actualización del filtro
  this.dataSource.filter = '' + Math.random();
  }



  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;

    this.dataSource.filter = filterValue.trim().toLowerCase();

  //   const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
  
  // // Asegúrate de que tu dataSource tenga las propiedades necesarias para los filtros
  //   this.dataSource.filter = (sale: SaleGetDTO) => {
  //     const matchesText = sale.code.toLowerCase().includes(filterValue) || 
  //                         sale.total.toString().toLowerCase().includes(filterValue) ||
  //                         ;


  //     const saleDate = new Date(sale.saleUpdateDate);
  //     const startDate = this.startDate ? new Date(this.startDate) : null;
  //     const endDate = this.endDate ? new Date(this.endDate) : null;

  //     const matchesDate = (!startDate || saleDate >= startDate) && (!endDate || saleDate <= endDate);

  //     return matchesText && matchesDate;
  //   };


  }


  initf(){
    this.dataSource.filterPredicate = (sale: any, filter: string) => {
      const lowerCaseFilter = filter.toLowerCase();
      
      const matchesText = 
        sale.code.toLowerCase().includes(lowerCaseFilter) ||
        sale.user.toLowerCase().includes(lowerCaseFilter) ||
        sale.typePayment.toLowerCase().includes(lowerCaseFilter) ||
        sale.saleTotal.toString().includes(lowerCaseFilter) ||
        sale.descuento.toString().includes(lowerCaseFilter) ||
        sale.total.toString().includes(lowerCaseFilter) ||
        // Si tienes una fecha como string, puedes formatearla aquí
        (sale.saleUpdateDate && sale.saleUpdateDate.toString().includes(lowerCaseFilter));
      
      const saleDate = new Date(sale.saleUpdateDate);
      const startDate = this.startDate ? new Date(this.startDate) : null;
      const endDate = this.endDate ? new Date(this.endDate) : null;

      const matchesDate = 
        (!startDate || saleDate >= startDate) && 
        (!endDate || saleDate <= endDate);

      return matchesText && matchesDate;
    };
  }



  onCobradoChange(element: any, event: Event) {
    let click: boolean = (event.target as HTMLInputElement).checked;

    // Cambia a true y ejecuta la función solo si 'cobrado' está en false
    if (!element.cobrado && click) {
        element.cobrado = true;
        this.editCollect();
    } else if (element.cobrado && !click) {
        event.preventDefault();
    }

  }

  private editCollect(){
    console.warn("Enviar a edit sale abierto cobro");
  }




























  add(){

  }

  editView(id:any){
    console.log("jajaja " + id)
    this.router.navigateByUrl(`main/sales/edit-sale/${id}`)
  }

  delete(id:any){
    this.helping.openFieldErrorWithOptions("Advertencia","Quieres eliminar esta compra, no hay vuelta atras??")
    .then((confirmed)=>{
      if (confirmed) {
          
        this.saleService.deleteSale(id).subscribe({
          next:(res)=>{
            this.helping.openSnackBar(res.message,"OK",5000)
          },
          error:(err)=>{
            this.helping.openSnackBar(err.message,"OK",5000)
          }
        })

      } else {}
    });


  }

  async print(element:SaleGetDTO){
    if(element.urlPdf === "" || element.urlPdf === null){

      let urlPdfnew = ""
      this.helping.setLoading(true);
      await  this.saleService.generateUrlPdf(element.idSale).subscribe({
        next:(res)=>{
          urlPdfnew = res.body;
          const sale = this.dataSource.data.find(s=>s.idSale === element.idSale)
          if(sale){
            sale.urlPdf = urlPdfnew;
            this.dataSource._updateChangeSubscription();
            this.helping.openPdfViewer(urlPdfnew)
          }
        },
        error:(err)=>{
          this.helping.openSnackBar(err.message,"OK",3000);
          this.helping.setLoading(false);

        },
        complete:()=>{
          this.helping.setLoading(false);
          
        }
      });


      

   
      
    }else{

      this.helping.openPdfViewer(element.urlPdf)
    }
    



  }

  download(element:SaleGetDTO){
    this.httpService.downloadPdf(element.urlPdf)
  }




}
