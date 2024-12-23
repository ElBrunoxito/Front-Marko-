import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { SelectorComponent } from "../selector/selector.component";
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TypePaymentService } from '../../../service/type-payment.service';
import { OperationsFrontService } from '../../../service/operations-front.service';
import { CommonModule, NgClass, NgIf } from '@angular/common';
import { PdfAddDTO } from '../../../models/PDF';
import { PdfService } from '../../../service/pdf.service';
import { UUID } from 'angular2-uuid';
import { CollectAddDTO, CollectGetDTO, GetCollectDTO } from '../../../models/Collect';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CollectService } from '../../../service/collect.service';
import { routes } from '../../../app.routes';
import { Router } from '@angular/router';

@Component({
  selector: 'app-collect-widget',
  standalone: true,
  imports: [
    SelectorComponent,
    ReactiveFormsModule,
    FormsModule,
    NgClass,
    NgIf,
    CommonModule
  ],
  templateUrl: './collect-widget.component.html',
  styleUrl: './collect-widget.component.scss'
})
export class CollectWidgetComponent implements OnInit,OnDestroy {

  public countProducts!: number ;
  public idTypePayment!:number;
  public discount!:number;
  public discountType!:string
  public subTotal!:number
  public discountView!:number;
  public total!:number



  submitted:boolean = false;
  listTypes:[] = []
  fechaHoraActual:Date = new Date()



  idSale: UUID = "idN";



  ngOnDestroy(): void {
    this.dialogRef.close();
  }

  constructor(
    private typePaymentService:TypePaymentService,
    private helping:OperationsFrontService,
    private pdfService:PdfService,
    private collectService:CollectService,
    public dialogRef: MatDialogRef<CollectWidgetComponent>,
    private router:Router,
    @Inject(MAT_DIALOG_DATA) public data: { isView:boolean,data:GetCollectDTO},



    
  ){
    this.getAllTypePayment()
    this.isView = data.isView
  }



  isView:boolean = false


  ngOnInit(): void {

    this.discountType = ''    
    //this.updatePdf()
    setInterval(()=>{
      this.fechaHoraActual = new Date();

    },1000)

    
    this.setCollectView(this.data.data)
    if(this.data.isView){
      //collectService.getCollect();
      /*** */

      this.collectService.getCollectById(this.idSale).subscribe((res)=>{
        const data: CollectGetDTO = res.body;
        this.idTypePayment = data.idTypePayment??0
        this.discount = data.discount??0
        this.subTotal = data.subTotal
        this.discountView = data.discount??0
        this.total = data.total??0
      })
      
    }


    //this.setCollectView();
  }

  



  getAllTypePayment() {
    //console.log(this.discount.toString())
    this.helping.setLoading(true);
    this.typePaymentService.getAll().subscribe({
      next: (data) => {
        this.listTypes = data.body;
        this.helping.setLoading(false);
      },
      error: (error) => {
        this.helping.openFieldErrorReload(() => {
          this.getAllTypePayment();
        });
        this.helping.setLoading(false);
      }
    });
  }



  setCollectView(data:GetCollectDTO){

    this.idSale = data.idSale;
    this.countProducts = data.countProducts;
    this.idTypePayment = data.idTypePayment??0
    this.discount = data.descuento??0
    this.subTotal = data.subTotal
    this.discountView = this.discount
    this.total = data.subTotal - (data.descuento??0)
  }


  getDiscount(event:any):void{

    let discount = event.target.value
    //let discount = this.discount
    //console.log(typeof this.discountType + " ::: " + this.discountType)


    if(this.discountType === "%"){
      console.log("SI")
      
      this.discountView = this.subTotal*discount/100;
      this.total = this.subTotal - this.discountView;
    }else {
      console.log("no" + this.discountType)

    //if(type === '#'){
      this.discountView = discount;
      this.total = this.subTotal - this.discountView;

    }

  }

  getDiscountSelect(event:any){
    //let discount = this.discount
    //console.log(typeof this.discountType + " ::: " + this.discountType)
    let discountType = event.target.value
    let discount = this.discount

    if(discountType === "%"){
      console.log("SI")
      
      this.discountView = this.subTotal*discount/100;
      this.total = this.subTotal - this.discountView;
    }else {
      console.log("no" + this.discountType)

    //if(type === '#'){
      this.discountView = discount;
      this.total = this.subTotal - this.discountView;

    }
  }






  updatePdf(){
/*
    const data: PdfAddDTO = {
      //urlImage: 'https://firebasestorage.googleapis.com/v0/b/marko-e432c.appspot.com/o/Mi%20Negocio%20S.A.C.%2Fotro.png?alt=media&token=e8b6aa41-4bee-4820-8391-2b9ff18d5086',  // URL de la imagen
      //urlImage:'https://firebasestorage.googleapis.com/v0/b/marko-e432c.appspot.com/o/Mi%20Negocio%20S.A.C.%2Fotro.png?alt=media&token=e8b6aa41-4bee-4820-8391-2b9ff18d5086',
      //urlImage:'https://firebasestorage.googleapis.com/v0/b/marko-e432c.appspot.com/o/Mi%20Negocio%20S.A.C.%2Fotro.png?alt=media&token=e8b6aa41-4bee-4820-8391-2b9ff18d5086'
      //nameBusiness: 'Nombre del Negocio',
      //addressBusiness: 'Dirección del Negocio',
      //phoneBusiness: '123456789',
      //code: 'Código123',
      //customer: 'Nombre del Cliente',
      //address: 'Dirección del Cliente',
      //dateCollect: new Date(),  // Fecha actual
      //moneyType: 'SOL',
      //products: [
//        { cantidad: 1, description: 'Producto 1', price: 10.0, total: 10.0 },
        //{ cantidad: 2, description: 'Producto 2', price: 15.0, total: 30.0 }
      //],
      //total: 40.0,
      //message: 'Gracias por su compra'
    };*/


/*
    const pdfBlob = this.pdfService.generatePDF(data);
    this.pdfBlobUrl = URL.createObjectURL(pdfBlob);*/
  }








  async createCollect(){

    if(!this.idTypePayment){
      this.helping.openSnackBar("Rellene el tipo de pago", "",4000)
    }

    if(this.discountView >= this.total){
      const confirmed = await this.helping.openFieldErrorWithOptions("Advertencia", "El descuento es igual o mayor al total\nEstas seguro de crear el cobro")
      if(!confirmed){
        return;
      }
    }


    console.warn("Continua")
    if(this.discountView === null || this.discountView === 0){
      this.helping.openSnackBar("No esta aplicando descuento para esta venta", "",4000)
    }

    this.helping.setLoading(true)
  

    const data: CollectAddDTO = {
      idSale:this.idSale,
      discountAmount: this.discountView,
      stateCollection: true,
      idTypePayment: this.idTypePayment
    }

    console.warn(data)
    //return;

    this.collectService.createCollect(data).subscribe({
      next:(res)=>{
        this.helping.openSnackBar(res.message, "", 10000)
        this.ngOnDestroy()
        this.router.navigateByUrl("main/sales")
      },
      error:(err)=>{
        console.error(err)
        this.helping.openFieldError(()=>{

        },err.message)
      },
      complete:()=>{
        this.helping.setLoading(false)
      }
    });



  }



  









}
