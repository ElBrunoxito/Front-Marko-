import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { ButtonModule } from 'primeng/button';
import { BuyAddDTO, BuyGetDTOWithDetailsGetDTO, DetailBuyAddDTO, DetailBuyGetDTO, ViewDetailsDTO } from '../../../../models/Buy';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FieldAutoCompleteComponent } from "../../../widgets/field-auto-complete/field-auto-complete.component";
import { SelectorComponent } from "../../../widgets/selector/selector.component";
import { NgClass, NgIf } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { BuyService } from '../../../../service/buy.service';
import { OperationsFrontService } from '../../../../service/operations-front.service';
import { UUID } from 'angular2-uuid';
import { DetailsProductAddOrEditComponent } from '../../../widgets/details-product-add-or-edit/details-product-add-or-edit.component';
import { ProductGetUserDTO } from '../../../../models/Products';
import { ProductService } from '../../../../service/product.service';
import { TypeComprobanteService } from '../../../../service/type-comprobante.service';
import { TypeComprobanteGetDTO } from '../../../../models/TypeComprobante';


@Component({
  selector: 'app-add-buy',
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
    FieldAutoCompleteComponent,
    SelectorComponent,
    NgClass,
    NgIf
],
  templateUrl: './add-buy.component.html',
  styleUrl: './add-buy.component.scss'
})
export class AddBuyComponent implements OnInit {

  displayedColumns: string[] = ['pro', 'fec', 'can', 'pri', 'sub', 'act'];

  dataSource = new MatTableDataSource<ViewDetailsDTO>([]);
  @ViewChild(MatPaginator) paginator!: MatPaginator;


  idTypeComprobante!:number
  nroComprobante:string = ""
  isDialogOpen:boolean = false

  //Para crear 
  submitted:boolean = false;

  //productos: ProductGetUserDTO[] = []



  //EDIT
  private idBuy?:UUID;
  isEditOrder :boolean = false;


  
  listTpes = []


  getAllTypeComprobante() {
    this.helping.setLoading(true);
    //const scrollPosition = document.documentElement.scrollTop || document.body.scrollTop;

    this.typeComprobanteService.getAll().subscribe({
      next: (data) => {
        this.listTpes = data.body;
        this.helping.setLoading(false);
      },
      error: (error) => {
        this.helping.openFieldErrorReload(() => {
          this.getAllTypeComprobante();
        });
        this.helping.setLoading(false);
      }
    });
  }

  

  constructor(
    public matDialog: MatDialog,
    private buyService:BuyService,
    public helping: OperationsFrontService,
    private route:ActivatedRoute,
    private productService:ProductService,
    private typeComprobanteService:TypeComprobanteService,
    private router:Router,

  ) {  
    this.getAllTypeComprobante();
  }

  ngOnInit(): void {


    //this.getAllProducts()
    const id = this.route.snapshot.paramMap.get('idBuy');

    //console.log("Id Route ", id)

    if(id){
      console.warn(id)
      this.idBuy = id;
      this.isEditOrder = true;
      this.getDataEditingOrder(this.idBuy);

    }
    

  

  }
  
  // getAllProducts() {
  //   this.productService.getAllForUser().subscribe((d) => {
  //     this.productos = d;
  //   });
  // }


 

  async getDataEditingOrder(id:UUID){
    await this.buyService.getById(id).subscribe((data)=>{
      this.idTypeComprobante = data.idTypeComprobante;
      this.nroComprobante = data.nroBuy;

      this.dataSource = new MatTableDataSource<ViewDetailsDTO>(this.transformDataToView(data));
      
      this.dataSource.paginator = this.paginator;
      
    })
    
  }



  


 

















//Para el codigo de barras bamos hacer un buscador

  addProduct(barCode = null){
    //const product
    this.isDialogOpen = true

    const dialogRef = this.matDialog.open(DetailsProductAddOrEditComponent, {
      width: '800px',
      maxWidth: '650px',
      height: '377px',
      data: { 
        product: null,
        isBuy:true,
        //productos:this.productos,
        barCode
      }
    });



    dialogRef.componentInstance.detail.subscribe((res:DetailBuyAddDTO) => {      
      const viewDetail:ViewDetailsDTO = {
        id:res.idDetailBuy!,
        description: res.description!,
        dueDate:res.dueDate,
        quantity:res.quantity,
        price:res.price,
        idProduct:res.idProduct
      } 

      this.dataSource.data.push(viewDetail);
      this.dataSource._updateChangeSubscription();
      this.dataSource.paginator = this.paginator;
      dialogRef.close()
      this.isDialogOpen = false
      
    });

    dialogRef.afterClosed().subscribe((res)=>{
      this.isDialogOpen = false;

    })

  }


  edit(e:ViewDetailsDTO){
    this.isDialogOpen = true

    const product: DetailBuyAddDTO ={
      idDetailBuy:e.id,
      quantity:e.quantity,
      price:e.price,
      dueDate:e.dueDate,
      idProduct:e.idProduct
    } 
    const dialogRef = this.matDialog.open(DetailsProductAddOrEditComponent, {
      width: '800px',
      maxWidth: '650px',
      height: '377px',
      data: { 
        product,
        isBuy:true,

        //productos:this.productos
      }
    });



    dialogRef.componentInstance.detail.subscribe((res:DetailBuyAddDTO) => {      
      const viewDetail:ViewDetailsDTO = {
        id:res.idDetailBuy!,
        description: res.description!,
        dueDate:res.dueDate,
        quantity:res.quantity,
        price:res.price,
        idProduct:res.idProduct
      } 

      let index =  this.dataSource.data.findIndex(d => d.id === res.idDetailBuy)
      this.dataSource.data[index] = viewDetail;
    
      this.dataSource._updateChangeSubscription();
      this.dataSource.paginator = this.paginator;

      dialogRef.close()
      this.isDialogOpen = false

      dialogRef.afterClosed().subscribe((res)=>{
        this.isDialogOpen = false;
  
      })
      
    });




  }
  delete(id:any){
    const index = this.dataSource.data.findIndex(item => item.id === id);

    if (index !== -1) {
      this.dataSource.data.splice(index, 1);  
      this.dataSource.data = [...this.dataSource.data];
    } else {
      console.warn("Elemento no encontrado para el ID:", id);
    }
    
  }






  //Funcion para crear o editar un producto
  createbuy(){
    this.helping.setLoading(true);
    if(this.dataSource.data.length === 0){
      this.helping.openFieldError(()=>{

      },"No puedes agregar la compra sin agregar productos")
      this.helping.setLoading(false);

      return
    }
    this.submitted = true;

    if(this.nroComprobante == null || this.nroComprobante == ""){
      this.helping.openFieldError(()=>{},"Completa todos los campos")
      this.helping.setLoading(false);
      return
    }



    const data:BuyAddDTO = {
      idBuy:this.idBuy,
      nroBuy:this.nroComprobante,
      idTypeComprobante:this.idTypeComprobante,
      detailsBuy:this.tranformData(this.dataSource.data),
    }

    console.log(data)


    if(this.isEditOrder){
      this.buyService.updateBuy(data).subscribe({
        next:(res)=> {
          this.helping.openSnackBar(res.message,"Alerta",4000)
          this.router.navigateByUrl('main/buys');
          
        },
        error:(err)=>{
          this.helping.openFieldError(()=>{},err.message);
        }
      })
      this.helping.setLoading(false);

    }else{

      
      this.buyService.createBuy(data).subscribe({
        next:(res)=> {
          this.helping.openSnackBar(res.message,"Alerta",4000)
          this.router.navigateByUrl('main/buys');
        },
        error:(err)=>{
          this.helping.openFieldError(()=>{},err.message);
        }
      })
      this.helping.setLoading(false);

    }



  
    








  }

  tranformData(data:ViewDetailsDTO[]):DetailBuyAddDTO[]{
    return data.map((d)=>{  
      const newd:DetailBuyAddDTO = {
        idDetailBuy:  d.id,
        quantity: d.quantity,
        price: d.price,
        dueDate: d.dueDate,
        idProduct: d.idProduct, 
      }
      return  newd
    })
  }

  transformDataToView(buy: BuyGetDTOWithDetailsGetDTO): ViewDetailsDTO[] {
    return buy.buys.map((d)=>{
      const newDetail: ViewDetailsDTO = {
        id:d.idDetailBuy,
        description:d.product.description,
        quantity: d.quantity,
        price: d.price,
        dueDate: d.dueDate,
        idProduct: d.product.idProduct,
      };
      return newDetail;
    })

  }




  getSum():number{
    return this.dataSource.data.reduce((i,p)=>i+(p.quantity*p.price),0)
  }




  /**/
  
  @HostListener('window:keydown', ['$event'])
  handleKeyDown(event: KeyboardEvent) {
    if(!this.isDialogOpen){
      this.helping.handleKeyPress(event,(barCode:any)=>{
        this.addProduct(barCode)
      });
    }

  }



}
