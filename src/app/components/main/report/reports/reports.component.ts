import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { GetViewReportDTO } from '../../../../models/Report';
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
  standalone: true,
  imports: [
    MatTableModule,
    MatPaginatorModule,
    MatButtonModule,
    ButtonModule,
    MatIcon,
    RouterLink,
    FormsModule,
  ],
  templateUrl: './reports.component.html',
  styleUrl: './reports.component.scss'
})
export class ReportsComponent implements OnInit{

  displayedColumns: string[] = ['tit', 'fec', 'ran','act'];
  dataSource = new MatTableDataSource<GetViewReportDTO>([]);
  public buscar :any = ""








  @ViewChild(MatPaginator) paginator!: MatPaginator;

  //public loading:boolean = false
  //public errorMessage!: string;

  constructor(
    private reportServie:ReportService,
    private helping: OperationsFrontService,
    private router: Router

  ) {

    
  }


  ngOnInit(): void {
    this.getAllData();


  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    
  }
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;

    this.dataSource.filter = filterValue.trim().toLowerCase();
    //console.log(this.dataSource.filteredData.length)
  }
  

  getAllData(){
    this.helping.setLoading(true)
    this.reportServie.getAll().subscribe({
      next:(res)=>{
        this.dataSource = new MatTableDataSource<GetViewReportDTO>(res);
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




  add(){
    this.router.navigateByUrl('main/report/generate')
  }

  delete(id:any){

  }


}
