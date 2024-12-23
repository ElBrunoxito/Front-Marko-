import { Component, EventEmitter, Inject, OnDestroy, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ProductService } from '../../../../service/product.service';
import { NgClass, NgFor, NgIf } from '@angular/common';
import { ProductAddDTO, ProductGet } from '../../../../models/Products';
import { LoadingSpinnerComponent } from "../../../widgets/loading-spinner/loading-spinner.component";
import { CategoryService } from '../../../../service/category.service';
import { FieldAutoCompleteComponent } from "../../../widgets/field-auto-complete/field-auto-complete.component";
import { MatSnackBar } from '@angular/material/snack-bar';
import { Response } from '../../../../models/Response';
import { OperationsFrontService } from '../../../../service/operations-front.service';

@Component({
  selector: 'app-add-product',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    NgClass,
    FieldAutoCompleteComponent
],
  templateUrl: './add-product.component.html',
  styleUrl: './add-product.component.scss'
})
export class AddProductComponent implements OnInit,OnDestroy{

 
  

  public productGroup!:FormGroup;
  public submitted = false;


  public categories:string[] = [];
  public units:string[] = [];

  public error!:string;



  isEdit :boolean = false;
  //idProduct!:string;

  @Output() productAdded = new EventEmitter<ProductGet>();


  constructor(
    private productService:ProductService,
    private categoryService:CategoryService,
    private fb:FormBuilder,
    public dialogRef: MatDialogRef<AddProductComponent>,
    private helping:OperationsFrontService,
    @Inject(MAT_DIALOG_DATA) public data: any,

  ) {
    this.productGroup = this.fb.group({
      codigo: ['', [Validators.required, Validators.pattern('^[0-9]+$')]], 
      description: ['', Validators.required], 
      stock: ['',[Validators.required, Validators.pattern('^[0-9]+$')]], 
      category: ['', Validators.required], 
      uni: ['', Validators.required] 
    });
  }




  async ngOnInit() {
    
    await this.getCategoriesAndUnits()
    //console.log("AAAAAAAAAAAAAAAAAAA: " + this.data.idProduct.toString())
    //console.warn("jaja" + this.data.product.toString() )
    if (this.data.idProduct == null || this.data.idProduct === '') {
      this.isEdit = false;
      this.setDataProduct(this.data.product)
    }else{
      this.isEdit = true;
      this.productService.getByIdForAdmin(this.data.idProduct).subscribe({
        next:(res)=>{
          //this.idProduct =res.idProduct
          const product: ProductAddDTO = {
            idProduct: res.idProduct,
            barCode:res.barCode,
            description: res.description,
            initialStock:res.initialStock,
            categoryAddFast: {
              name: res.category,
            },
            unitAddFast: {
              name: res.unit
            }
          }
          this.setDataProduct(product)
        },
        error:(err)=>{
          this.helping.setLoading(true)
        }
      })
    }


  }


  ngOnDestroy(): void {
    if(!this.isEdit) 
      this.dialogRef.close(this.getDataProduct());
    //else this.dialogRef.close({});

  } 

  getCategoriesAndUnits(){
    this.helping.setLoading(true)
    
    this.categoryService.getAllCategoriesAndUnits().subscribe({
      next:(res) => {
        this.categories = res.body.categories as string[];
        this.units = res.body.units as string[];
        this.helping.setLoading(false)

      },

      error:(error) => {
        this.helping.setLoading(false)
        this.helping.openSnackBar('Error al obtener las categorías','OK',3500)
        //console.error('Error al obtener las categorías:', error);
      }
    })
  }


  setDataProduct(data: ProductAddDTO) {
    this.productGroup = this.fb.group({
      codigo: [data.barCode, [Validators.required, Validators.pattern('^[0-9]+$')]], 
      description: [data.description, Validators.required], 
      stock: [data.initialStock,[Validators.required, Validators.pattern('^[0-9]+$')]], 
      category: [data.categoryAddFast.name, Validators.required], 
      uni: [data.unitAddFast.name, Validators.required] 
    });
  }



  getDataProduct(): ProductAddDTO {
    return {
      barCode: this.productGroup.get('codigo')?.value, // Obtiene el valor del campo 'codigo'
      description: this.productGroup.get('description')?.value, // Obtiene el valor del campo 'description'
      initialStock: this.productGroup.get('stock')?.value, // Obtiene el valor del campo 'stock'
      categoryAddFast: {
        name: this.productGroup.get('category')?.value // Obtiene el valor del campo 'category'
      },
      unitAddFast: {
        name: this.productGroup.get('uni')?.value // Obtiene el valor del campo 'uni'
      }
    };
  }

  clearFields():void{
    this.productGroup = this.fb.group({
      codigo: ['', [Validators.required, Validators.pattern('^[0-9]+$')]], 
      description: ['', Validators.required], 
      stock: ['', Validators.pattern('^[0-9]+$')], 
      category: ['', Validators.required], 
      uni: ['', Validators.required] 
    });
    this.submitted = false;
  }


  
  





  async add(){

    //Si clickea en agregar el campo stock se vuelve 
    if (this.productGroup.get("stock")?.value === "") {
      this.productGroup.patchValue({ stock: 0 });
    }


    this.submitted = true;

    if(this.productGroup.valid){

      var product:ProductAddDTO = {  
        idProduct:this.data.idProduct!,
        barCode:this.productGroup.get("codigo")?.value,
        description:this.productGroup.get("description")?.value,
        initialStock:this.productGroup.get("stock")?.value,
        categoryAddFast: {
          name:this.productGroup.get("category")?.value
        },
        unitAddFast:{
          name:this.productGroup.get("uni")?.value
        }
      }
      const confirmed = await this.helping.openFieldErrorWithOptions("Advertencia", `El producto ${product.description} se va agregar con stock inicial${product.initialStock}\nEstas seguro de crear el cobro`)
      if(!confirmed){
        return;
      }
      this.helping.setLoading(true)
  



      if(this.isEdit){
        this.productService.update(product).subscribe({
          next:(res:Response)=>{      
            const product:ProductGet = res.body as ProductGet
            this.helping.openSnackBar(res.message,"OK",5000)
            this.clearFields();

            this.helping.setLoading(false)
            product.state = product.state ? "ACTIVO":"INACTIVO"
            this.productAdded.emit(product)
            this.ngOnDestroy();
          },
          error:(err)=>{
            console.warn(err.message)
            this.error = err.message;
            this.helping.setLoading(false)
          }
        })
  

      }else{
        this.productService.add(product).subscribe({
          next:(res:Response)=>{      
            const product:ProductGet = res.body as ProductGet
            this.helping.openSnackBar(res.message,"OK",5000)
            this.clearFields();
            this.helping.setLoading(false)
            product.state = product.state ? "ACTIVO":"INACTIVO"          
            this.productAdded.emit(product)
          },
          error:(err)=>{
            console.warn(err.message)
            this.error = err.message;
            this.helping.setLoading(false)
          },
          complete:()=>{
            this.helping.setLoading(false)
          }
        })
  
      }

    }else{
      console.log("valido no")
    }
  }


}
