import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { GetReportDTO } from '../../../../models/Report';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { OperationsFrontService } from '../../../../service/operations-front.service';
import { ReportService } from '../../../../service/report.service';
import { MatButtonModule } from '@angular/material/button';
import { ButtonModule } from 'primeng/button';
import { MatIcon } from '@angular/material/icon';
import { Router, RouterLink } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { NgIf } from '@angular/common';

@Component({
    selector: 'app-reports',
    imports: [
        MatTableModule,
        MatPaginatorModule,
        MatButtonModule,
        ButtonModule,
        MatIcon,
        FormsModule,
    ],
    templateUrl: './reports.component.html',
    styleUrl: './reports.component.scss'
})
export class ReportsComponent implements OnInit{

  displayedColumns: string[] = ['tit', 'fec', 'ran','usr','act'];
  dataSource = new MatTableDataSource<GetReportDTO>([]);
  public buscar :any = ""








  @ViewChild(MatPaginator) paginator!: MatPaginator;

  //public loading:boolean = false
  //public errorMessage!: string;

  constructor(
    private reportServie:ReportService,
    public helping: OperationsFrontService,
    private router: Router

  ) {

    
  }


  ngOnInit(): void {
    this.getAll();


  }

  getAll(){
    this.helping.setLoading(true)
    this.reportServie.getAll().subscribe({
      next:(res:any)=>{
        this.dataSource = new MatTableDataSource<GetReportDTO>(res.body);
        this.dataSource.paginator = this.paginator;
      },
      error:(err)=>{
        this.helping.openSnackBar(err.message,"OK",5000)
      },
      complete:()=>{
        this.helping.setLoading(false)
      }
    })
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    
  }
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;

    this.dataSource.filter = filterValue.trim().toLowerCase();
    //console.log(this.dataSource.filteredData.length)
  }
  





  add(){
    this.router.navigateByUrl('main/report/generate')
  }

  openPDF(element:GetReportDTO){
    this.helping.openPdfViewer(element.urlPdf)
  }


}
