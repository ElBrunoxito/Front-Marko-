import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatTable, MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatFormField, MatFormFieldControl, MatFormFieldModule}  from '@angular/material/form-field';
import { Paginator, PaginatorModule, PaginatorState } from 'primeng/paginator';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { ProductAddDTO, ProductGet } from '../../../../models/Products';
import { MatButton, MatButtonModule } from '@angular/material/button';
import { RouterLink } from '@angular/router';
import { MatIcon } from '@angular/material/icon';
import { BarcodeScannerLivestreamOverlayModule } from 'ngx-barcode-scanner';
import { AddProductComponent } from '../add-product/add-product.component';
import { MatDialog } from '@angular/material/dialog';
import { ProductService } from '../../../../service/product.service';
import { FormsModule, NgModel } from '@angular/forms';
import { LoadingSpinnerComponent } from "../../../widgets/loading-spinner/loading-spinner.component";
import { NgIf } from '@angular/common';
import { ErrorDialogComponent } from '../../../widgets/error-dialog/error-dialog.component';
import { OperationsFrontService } from '../../../../service/operations-front.service';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-products',
  standalone: true,
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
  templateUrl: './products.component.html',
  styleUrl: './products.component.scss'
})



export class ProductsComponent implements OnInit{
  //Paginator
  displayedColumns: string[] = ['cod', 'des', 'uni', 'stk','stkA', 'cat','est','act'];
  dataSource = new MatTableDataSource<ProductGet>([]);
  public buscar :any = ""


  //isEdit:boolean = false


  //Producto guardado o para editar
  private productSaveOrEdit: ProductAddDTO = {
    barCode: '',             
    description: '',         
    //initialStock: ,         
    categoryAddFast: {       
      name: ''
    },
    unitAddFast: {            
      name: ''
    }
  };



  @ViewChild(MatPaginator) paginator!: MatPaginator;

  //public loading:boolean = false
  //public errorMessage!: string;

  constructor(
    public matDialog: MatDialog,
    private productService:ProductService,
    private helping: OperationsFrontService

  ) {

    
  }


  ngOnInit(): void {
    this.getAllData();

    //this.dataSource.paginator = this.paginator;

  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    
  }
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;

    this.dataSource.filter = filterValue.trim().toLowerCase();
    //console.log(this.dataSource.filteredData.length)
  }











//Opciones con conexion backend

  async getAllData(){ 
    this.helping.setLoading(true)
    await this.productService.getAll().subscribe({
      next:(res)=>{
        this.dataSource = new MatTableDataSource<ProductGet>(res);
        this.dataSource.paginator = this.paginator;       
        this.helping.setLoading(false)
      },
      error:(err)=>{
        this.helping.setLoading(false)
        this.helping.openFieldErrorReload(()=>{
          this.getAllData();
        })
      },
    })

    
  }


  // Agregar y editar
  add(){
    
    console.log(this.productSaveOrEdit)
    const dialogRef = this.matDialog.open(AddProductComponent, {
      width: '483px',
      height: '377px',
      data: { 
        //codigo:this.buscar,
        idProduct: null,
        product:this.productSaveOrEdit
       }
    });

    dialogRef.componentInstance.productAdded.subscribe((result:ProductGet) => {      

      this.dataSource.data.push(result);
      this.dataSource._updateChangeSubscription();
      this.dataSource.paginator = this.paginator;
      
    });

    dialogRef.afterClosed().subscribe((res:ProductAddDTO) => {
      if(res == null){
        this.productSaveOrEdit = {
          idProduct: '',
          barCode: '',
          description: '',
          initialStock: 0,
          categoryAddFast:{
            name:''
          },
          unitAddFast:{
            name:''
          }
        };
      }else{
        this.productSaveOrEdit = res;
      }

    });

  }

  edit(id:any){
    const dialogRef = this.matDialog.open(AddProductComponent, {
      width: '483px',
      height: '377px',
      data: { 
        idProduct: id,
        //product: null
       }
    });

    dialogRef.componentInstance.productAdded.subscribe((result:ProductGet) => {      
      let index =  this.dataSource.data.findIndex(d => d.idProduct === result.idProduct)
      this.dataSource.data[index] = result;
      
      this.dataSource._updateChangeSubscription();
      this.dataSource.paginator = this.paginator;
      
    });

    dialogRef.afterClosed().subscribe((res:ProductAddDTO) => {
//      console.log('El diálogo ha sido cerrado');
      this.productSaveOrEdit = res;

    });

  }

  delete(id:any){

  }






}

