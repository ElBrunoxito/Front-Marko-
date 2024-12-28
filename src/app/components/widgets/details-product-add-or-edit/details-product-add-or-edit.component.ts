import { NgClass, NgFor, NgIf } from '@angular/common';
import { Component, EventEmitter, Inject, OnDestroy, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { OperationsFrontService } from '../../../service/operations-front.service';
import { ProductService } from '../../../service/product.service';
import { ProductGetUserDTO } from '../../../models/Products';
import { FieldAutoCompleteComponent } from "../field-auto-complete/field-auto-complete.component";
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatOption, MatSelect } from '@angular/material/select';
import { SelectProductWComponent } from "../select-product-w/select-product-w.component";
import { DetailBuyAddDTO } from '../../../models/Buy';
import { UUID } from 'angular2-uuid';
import { DetailSaleAddDTO } from '../../../models/Sale';
  //import { notZeroValidator } from './path-to-your-validator'; // Asegúrate de importar el validador

@Component({
  selector: 'app-details-product-add-or-edit',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    NgClass,
    SelectProductWComponent
],
  templateUrl: './details-product-add-or-edit.component.html',
  styleUrl: './details-product-add-or-edit.component.scss'
})
export class DetailsProductAddOrEditComponent implements OnInit,OnDestroy{


  public productos: ProductGetUserDTO[] = [];

  
  public productGroup!:FormGroup;
  public submitted = false;
  
  public error!:string;


  public isBuy:boolean = true



  isEdit :boolean = false;
  idDetail!:UUID | null
  




  @Output() detail = new EventEmitter<DetailBuyAddDTO | DetailSaleAddDTO>();


  constructor(
    private fb:FormBuilder,
    public dialogRef: MatDialogRef<DetailsProductAddOrEditComponent>,
    private helping:OperationsFrontService,
    private productService:ProductService,
    @Inject(MAT_DIALOG_DATA) public data: any,

  ) {

    this.productGroup = this.fb.group({
      idProduct: ['', Validators.required], 
      dueDate:['',this.data.isBuy?Validators.required:null],
      quantity:['',[Validators.required, Validators.pattern('^[0-9]+$'),Validators.min(1)]],
      price: ['', [Validators.required, Validators.pattern('^\\d+(\\.\\d{1,2})?$'),Validators.min(0.01)]]

    });
  }


  public barCode:string = '';


  ngOnDestroy(): void {
  }

  priceSuggest!:number 
  onProductSelected(price:number) {
    this.productGroup.patchValue({price})
    this.priceSuggest = price
    
  }
  ngOnInit(): void {

    this.isBuy = this.data.isBuy;


    setInterval(()=>{
      console.warn(this.productGroup.get("idProduct")?.value)
    },2000)
    //this.productos = this.data.productos;
    this.getAllProducts()

    if(this.data.barCode){
      //console.log(this.data.barCode)
      this.barCode = this.data.barCode
      //let id = this.productos.find(p=>p.barCode === this.data.barCode)

      //console.log("ajajjaj" + id?.idProduct);
      //this.productGroup.setValue({"idProduct": id?.idProduct})
    }
    else if(this.data.product == null || this.data.product === ''){
      this.isEdit = false;
      //this.
    }else{
      this.isEdit = true;


      const product: DetailBuyAddDTO | DetailSaleAddDTO = this.data.product

      this.setDataProduct(product);

    }



  }

  getAllProducts() {
    this.productService.getAllForUser().subscribe((data) => {
      this.productos = data;
    });
  }







  add(){
    this.submitted = true;


    if(this.productGroup.valid){
      this.helping.setLoading(true)
      
      const detail : DetailBuyAddDTO | DetailSaleAddDTO =  this.getDataProduct();

      if(this.isEdit){
        this.helping.openSnackBar("Producto editado a la compra","OK",5000)
        this.clearFields();
        this.helping.setLoading(false)

        this.detail.emit(detail)
        
        this.ngOnDestroy()

      }else{
        this.helping.openSnackBar("Producto agregado a la compra","OK",5000)
        this.clearFields();
        this.helping.setLoading(false)

        this.detail.emit(detail)

        this.ngOnDestroy()
      }
      


    }else{
      console.log("No valido")
    }



  }




  //OPCIONES PARA LOS CAMPOS
  setDataProduct(detail: DetailBuyAddDTO | DetailSaleAddDTO) {
    if(this.isBuy){
      const data = detail as DetailBuyAddDTO;
      this.idDetail = data.idDetailBuy!;

      this.productGroup.patchValue({ // Utiliza patchValue para actualizar los valores
      
        idProduct:data.idProduct,
        dueDate: this.helping.formatDate(data.dueDate),
        quantity: data.quantity,
        price: data.price
      });

    }else{
      const data = detail as DetailSaleAddDTO;
      this.idDetail = data.idDetailSale!;

      this.productGroup.patchValue({ // Utiliza patchValue para actualizar los valores
      
        idProduct:data.idProduct,
        dueDate: '',
        quantity: data.quantity,
        price: data.price
      });
    }




  }


  getDataProduct(): DetailBuyAddDTO | DetailSaleAddDTO{
    
    const product = this.productos.find(p => p.idProduct === this.productGroup.get('idProduct')?.value)

    if(this.isBuy){
      const data:DetailBuyAddDTO = {
        idDetailBuy: this.idDetail == null ? this.helping.generateUUID : this.idDetail,
        description:this.getFormatProduct(product?.barCode,product?.description),
        idProduct: this.productGroup.get('idProduct')?.value,
        dueDate: this.helping.formatFromDateString(this.productGroup.get('dueDate')?.value),
        quantity: this.productGroup.get('quantity')?.value,
        price: this.productGroup.get('price')?.value
      
      };
      return data;

    }else{
      const data:DetailSaleAddDTO = {
        idDetailSale: this.idDetail == null ? this.helping.generateUUID : this.idDetail,
        description:this.getFormatProduct(product?.barCode,product?.description),
        idProduct: this.productGroup.get('idProduct')?.value,
        quantity: this.productGroup.get('quantity')?.value,
        price: this.productGroup.get('price')?.value
      
      };
      return data;
    }




  }

  clearFields():void{

    this.productGroup.reset({
      idProduct: null,
      dueDate: null,
      quantity: null,
      price: null
    });
    this.idDetail = null;
    this.submitted = false;
  }


  getFormatProduct(barCode:string|undefined, description:string|undefined){
    return barCode +" - " + description

  }





}
