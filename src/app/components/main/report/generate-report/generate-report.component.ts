import { Component, OnInit } from '@angular/core';
import { SelectProductWComponent } from "../../../widgets/select-product-w/select-product-w.component";
import { ProductService } from '../../../../service/product.service';
import { ProductGetUserDTO } from '../../../../models/Products';
import { FormBuilder, FormGroup, FormsModule, NgModel, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgClass } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatIcon } from '@angular/material/icon';
import { OperationsFrontService } from '../../../../service/operations-front.service';
import { ReportService } from '../../../../service/report.service';
import pdfMake from 'pdfmake/build/pdfmake';
import { PdfService } from '../../../../service/pdf.service';
import { Router } from '@angular/router';
import { ReportRequest } from '../../../../models/Report';
@Component({
    selector: 'app-generate-report',
    imports: [
        NgClass,
        MatInputModule,
        FormsModule,
        ReactiveFormsModule,
    ],
    templateUrl: './generate-report.component.html',
    styleUrl: './generate-report.component.scss'
})
export class GenerateReportComponent implements OnInit {
  //public productos: ProductGetUserDTO[] = [];
  public reportGroup!:FormGroup
  public submitted = false;

  public type:number = 0


  // cobrado:any = 0;
  // sinCobro:any = 0;


  constructor(
    private productService:ProductService,
    private fb:FormBuilder,
    private helping:OperationsFrontService,
    private reportService:ReportService,
    private router:Router

  ){
    this.reportGroup = this.fb.group({
      title: ['', Validators.required], 
      //idProduct: ['', Validators.required], 
      startDate:['',Validators.required],
      endDate:['',Validators.required],

      //quantity:['',[Validators.required, Validators.pattern('^[0-9]+$'),Validators.min(1)]],
      //price: ['', [Validators.required, Validators.pattern('^\\d+(\\.\\d{1,2})?$'),Validators.min(0.01)]]

    });
  }


  ngOnInit(): void {
    //this.getAllProducts()

    const hoy =  new Date()
    this.reportGroup.patchValue({
      startDate: this.helping.formatDateToString(hoy),
      endDate: this.helping.formatDateToString(hoy),

    })
  }

/*
  getAllProducts() {
    this.productService.getAllForUser().subscribe((data) => {
      this.productos = data;
    });
  }*/


  generate(){
    const data : ReportRequest = {
      title: this.reportGroup.get('title')?.value,
      startDate: this.helping.formatFromDateString(this.reportGroup.get('startDate')?.value),
      endDate: this.helping.formatFromDateString(this.reportGroup.get('endDate')?.value),  
    }
    this.helping.setLoading(true);
    console.warn(data)

    this.reportService.generateForProduct(data).subscribe({

      next:(res)=>{
        console.log(res.body)
        const urlPdfnew :string= res.body;
        this.helping.openSnackBar(res.message,"OK",5000)
        this.helping.openPdfViewer(urlPdfnew)
        this.router.navigateByUrl("main/report")
      },
      error:(err)=>{
        this.helping.openFieldError(()=>{

        },err.message)
      },
      complete:()=>{
        this.helping.setLoading(false);

      }

    })
  }




}
