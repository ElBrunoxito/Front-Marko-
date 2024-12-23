import { Component, OnInit } from '@angular/core';
import { SelectProductWComponent } from "../../../widgets/select-product-w/select-product-w.component";
import { ProductService } from '../../../../service/product.service';
import { ProductGetUserDTO } from '../../../../models/Products';
import { FormBuilder, FormGroup, FormsModule, NgModel, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgClass } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatIcon } from '@angular/material/icon';
import { OperationsFrontService } from '../../../../service/operations-front.service';
import { CreateReportGenerateProductDTO } from '../../../../models/Report';
import { ReportService } from '../../../../service/report.service';
import pdfMake from 'pdfmake/build/pdfmake';
import { PdfService } from '../../../../service/pdf.service';
@Component({
  selector: 'app-generate-report',
  standalone: true,
  imports: [
    SelectProductWComponent,
    NgClass,
    MatInputModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  templateUrl: './generate-report.component.html',
  styleUrl: './generate-report.component.scss'
})
export class GenerateReportComponent implements OnInit {
  public productos: ProductGetUserDTO[] = [];
  public reportGroup!:FormGroup
  public submitted = false;

  public type:number = 0


  cobrado:any = 0;
  sinCobro:any = 0;


  constructor(
    private productService:ProductService,
    private fb:FormBuilder,
    private helping:OperationsFrontService,
    private reportService:ReportService,
    private pdfService:PdfService

  ){
    this.reportGroup = this.fb.group({
      title: ['', Validators.required], 
      idProduct: ['', Validators.required], 
      startDate:['',Validators.required],
      endDate:['',Validators.required],

      //quantity:['',[Validators.required, Validators.pattern('^[0-9]+$'),Validators.min(1)]],
      //price: ['', [Validators.required, Validators.pattern('^\\d+(\\.\\d{1,2})?$'),Validators.min(0.01)]]

    });
  }


  ngOnInit(): void {
    this.getAllProducts()
  }


  getAllProducts() {
    this.productService.getAllForUser().subscribe((data) => {
      this.productos = data;
    });
  }


  generate(){
    this.submitted = true
    const bit1 = this.sinCobro ? 1 : 0;
    const bit2 = this.cobrado ? 1 : 0;
    console.log(bit1 + " : " + bit2)
    const binaryValue = `${bit1}${bit2}`;
    const decimalValue = parseInt(binaryValue, 2);

    if(decimalValue === 0){
      this.helping.openSnackBar("Seleccione si el filtor va a ser con cobro o no", "OK",3000)
      return;
    }
    if(this.reportGroup.valid){
      /*const data: CreateReportGenerateProductDTO = {
        title: this.reportGroup.get('title')?.value,
        idProduct : this.reportGroup.get('idProduct')
      }*/
        const data: CreateReportGenerateProductDTO = this.reportGroup.value as CreateReportGenerateProductDTO
        data.typeFilter = decimalValue
        //console.log(data)
        //TYPE 1
        console.log(data)
        this.reportService.generateForProduct(data).subscribe({
          next:(res)=>{
            //this.helping
            //pdfMake
            
            let report = res.body.report 
            const definition = this.pdfService.generatePDFType1(report)
            pdfMake.createPdf(definition).open()
            
          },
          error:(err)=>{
            console.warn(err.message)
          }
        })

    }else{

    }

  }


}
