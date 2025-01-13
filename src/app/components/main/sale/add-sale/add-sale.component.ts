import { Component, HostListener, ViewChild } from '@angular/core';
import { DetailSaleAddDTO, SaleAddDTO, SaleGetDTOWithDetailsGetDTO, SaleGetSimpleDTO, ViewDetailsSaleDTO } from '../../../../models/Sale';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { UUID } from 'angular2-uuid';
import { MatDialog } from '@angular/material/dialog';
import { SaleService } from '../../../../service/sale.service';
import { OperationsFrontService } from '../../../../service/operations-front.service';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ProductService } from '../../../../service/product.service';
import { DetailsProductAddOrEditComponent } from '../../../widgets/details-product-add-or-edit/details-product-add-or-edit.component';
import { ViewDetailsDTO } from '../../../../models/Buy';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { ButtonModule } from 'primeng/button';
import { MatIcon } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { FieldAutoCompleteComponent } from '../../../widgets/field-auto-complete/field-auto-complete.component';
import { SelectorComponent } from '../../../widgets/selector/selector.component';
import { CommonModule, NgClass, NgIf } from '@angular/common';
import { TypeComprobanteGetDTO } from '../../../../models/TypeComprobante';
import { TypeComprobanteService } from '../../../../service/type-comprobante.service';
import { GetCollectDTO } from '../../../../models/Collect';
import { CollectWidgetComponent } from '../../../widgets/collect-widget/collect-widget.component';

@Component({
    selector: 'app-add-sale',
    imports: [
        MatFormFieldModule,
        MatTableModule,
        MatPaginatorModule,
        MatButtonModule,
        ButtonModule,
        MatIcon,
        FormsModule,
        SelectorComponent,
        NgClass,
        CommonModule
    ],
    templateUrl: './add-sale.component.html',
    styleUrl: './add-sale.component.scss'
})
export class AddSaleComponent {

  displayedColumns: string[] = ['pro', 'can', 'pri', 'sub', 'act'];

  dataSource = new MatTableDataSource<ViewDetailsSaleDTO>([]);
  @ViewChild(MatPaginator) paginator!: MatPaginator;


  idTypeComprobante!:number

  nroComprobante:string = ""

  isDialogOpen:boolean = false

  //Para crear 
  submitted:boolean = false;




  //EDIT
  private idSale?:UUID;
  isEditOrder :boolean = false;



  public sale!: SaleGetDTOWithDetailsGetDTO 

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



  fechaHoraActual:Date = new Date()
  constructor(
    public matDialog: MatDialog,
    private saleService:SaleService,
    public helping: OperationsFrontService,
    private route:ActivatedRoute,
    private productService:ProductService,
    private typeComprobanteService:TypeComprobanteService,
    private router:Router,


  ) {  
    this.getAllTypeComprobante();

  }


  
  

  ngOnInit(): void {
    
    setInterval(()=>{
      this.fechaHoraActual = new Date();
    },1000)

    //this.getAllProducts()
    const id = this.route.snapshot.paramMap.get('idSale');


    if(id){
      console.warn(id)
      this.idSale = id;
      this.isEditOrder = true;
      this.isCreated = true;

      this.getDataEditingOrder(this.idSale);

    }
    

  

  }
  
  // getAllProducts() {
  //   this.productService.getAllForUser().subscribe((d) => {
  //     this.productos = d;
  //   });
  // }



 

  getDataEditingOrder(id:UUID){
    this.saleService.getById(id).subscribe({
      
      next:(res)=>{
        const data = res.body as SaleGetDTOWithDetailsGetDTO;
        this.idTypeComprobante = data.idTypeComprobante;
        this.nroComprobante = data.code;
        this.sale = data;
        //console.log(this.sale.idCollection)
        this.dataSource = new MatTableDataSource<ViewDetailsSaleDTO>(this.transformDataToView(data));
        
        this.dataSource.paginator = this.paginator;
        this.helping.openSnackBar(res.message,"Mensaje",4000)
      
      },
      error:(err)=>{
        console.error("ptmr" + err.message + "kajaj")
        this.helping.openFieldError(()=>{},err.message);
      }


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
        isBuy:false,
        type:'SALE',
        barCode
      }
    });



    dialogRef.componentInstance.detail.subscribe((res:DetailSaleAddDTO) => {      
      const viewDetail:ViewDetailsSaleDTO = {
        id:res.idDetailSale!,
        description: res.description!,        
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
      this.isDialogOpen = false
    })

  }


  edit(e:ViewDetailsSaleDTO){
    this.isDialogOpen = true

    const product: DetailSaleAddDTO ={
      idDetailSale:e.id,
      quantity:e.quantity,
      price:e.price,
      idProduct:e.idProduct
    } 
    const dialogRef = this.matDialog.open(DetailsProductAddOrEditComponent, {
      width: '800px',
      maxWidth: '650px',
      height: '377px',
      data: { 
        product,
        isBuy:false,
        type:'SALE',


        //productos:this.productos,

      }
    });



    dialogRef.componentInstance.detail.subscribe((res:DetailSaleAddDTO) => {    
      console.warn(res)  
      const viewDetail:ViewDetailsSaleDTO = {
        id:res.idDetailSale!,
        description: res.description!,
        quantity:res.quantity,
        price:res.price,
        idProduct:res.idProduct
      } 

      let index =  this.dataSource.data.findIndex(d => d.id === res.idDetailSale)
      this.dataSource.data[index] = viewDetail;
    
      this.dataSource._updateChangeSubscription();
      this.dataSource.paginator = this.paginator;

      dialogRef.close()
      this.isDialogOpen = false

      
    });
    dialogRef.afterClosed().subscribe((res)=>{
      this.isDialogOpen = false
    })




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






  public isCreated:boolean = false;

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



    const data:SaleAddDTO = {
      idSale:this.idSale,
      //nroBuy:this.nroComprobante,
      idTypeComprobante:this.idTypeComprobante,
      detailsSale:this.tranformData(this.dataSource.data),
    }

    console.log(data)




    if(this.isEditOrder){
      this.saleService.updateSale(data).subscribe({
        next:(res)=> {
          this.helping.openSnackBar(res.message,"Alerta",4000)
          //this.router.navigateByUrl('main/sales');
          //AQUI VOY A OBTENER EL ID SALE PARA ENVIAR A EL COBRO
          this.isCreated = true;
          const response = res.body as SaleGetSimpleDTO;
          
          this.idSale = response.idSale;
        },
        error:(err)=>{
          this.helping.openFieldError(()=>{},err.message);
        }
      })
      this.helping.setLoading(false);

    }else{

      
      this.saleService.createSale(data).subscribe({
        next:(res)=> {
          this.helping.openSnackBar(res.message,"Alerta",4000)
          //this.router.navigateByUrl('main/sales');
          //AQUI VOY A OBTENER EL ID SALE PARA ENVIAR A EL COBRO
          this.isCreated = true;
          this.isEditOrder = true;
          
          const response = res.body as SaleGetSimpleDTO;
          
          this.idSale = response.idSale;
          this.nroComprobante = response.code
          this.createCollect()
        },
        error:(err)=>{
          this.helping.openFieldError(()=>{},err.message);
        }
      })
      this.helping.setLoading(false);

    }

    








  }

  viewCollect(){
    
    const data: GetCollectDTO = {
      idSale:this.idSale!,
      countProducts:this.dataSource.data.length,
      subTotal:this.getSum(),
    }

    this.matDialog.open(CollectWidgetComponent, {
      width: '900px', // Opcional: establece el ancho del diálogo
      maxWidth:'800px',
      height:'600px',
      maxHeight: '600px',
      
      data: {
        data,
        isView:true
      }
    });
  }

  createCollect(){
    if(!this.isCreated){
      return;
    }

    const data: GetCollectDTO = {
      idSale:this.idSale!,
      countProducts:this.dataSource.data.length,
      subTotal:this.getSum(),
    }

    this.matDialog.open(CollectWidgetComponent, {
      width: '900px', // Opcional: establece el ancho del diálogo
      maxWidth:'800px',
      height:'600px',
      maxHeight: '600px',
      
      data: {
        data,
        isView:false
      }
    });

  }

  tranformData(data:ViewDetailsSaleDTO[]):DetailSaleAddDTO[]{
    return data.map((d)=>{  
      const newd:DetailSaleAddDTO = {
        idDetailSale:  d.id,
        quantity: d.quantity,
        price: d.price,
        idProduct: d.idProduct, 
      }
      return  newd
    })
  }

  transformDataToView(data: SaleGetDTOWithDetailsGetDTO): ViewDetailsSaleDTO[] {
    return data.saleDetails.map((d)=>{
      const newDetail: ViewDetailsSaleDTO = {
        id:d.idDetailSale,
        description:d.product.description,
        quantity: d.quantity,
        price: d.price,
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
