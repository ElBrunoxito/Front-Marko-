import { Component, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { Router, RouterLink } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { BuyGetDTO } from '../../../../models/Buy';
import { MatDialog } from '@angular/material/dialog';
import { BuyService } from '../../../../service/buy.service';
import { OperationsFrontService } from '../../../../service/operations-front.service';
import { ErrorDialogComponent } from '../../../widgets/error-dialog/error-dialog.component';

@Component({
    selector: 'app-buys',
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
    templateUrl: './buys.component.html',
    styleUrl: './buys.component.scss'
})
export class BuysComponent implements OnInit {


  displayedColumns: string[] = ['fec','nro','tip','mon','act']

  dataSource = new MatTableDataSource<BuyGetDTO>([]);
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  public buscar :any = ""




  constructor(
    public matDialog: MatDialog,
    private buyService:BuyService,
    public helping: OperationsFrontService,
    private router:Router
  ) {

    
  }



  ngOnInit(): void {
    this.getAllBuys();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator
  }

  getAllBuys(){
    this.helping.setLoading(true)
    this.buyService.getAll().subscribe({
      next:(res)=>{
        this.dataSource = new MatTableDataSource<BuyGetDTO>(res);
        this.dataSource.paginator = this.paginator;
        this.helping.setLoading(false)
      },
      error:(err)=>{
        this.helping.setLoading(false)
        const dialogRef = this.matDialog.open(ErrorDialogComponent, {
          disableClose:true,
          width: '250px',
          data: { message: "No se ha podido cargar los datos" },
        });
    
        dialogRef.afterClosed().subscribe((res)=>{
          if(res){
            this.getAllBuys();
          }
        })
      },


    })
  } 








  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;

    this.dataSource.filter = filterValue.trim().toLowerCase();
  }






























  add(){

  }

  edit(id:any){
    console.log("jajaja " + id)
    this.router.navigateByUrl(`main/buys/edit-buy/${id}`)
  }

  delete(id:any){
    console.log(id)
    this.helping.openFieldErrorWithOptions("Advertencia","Quieres eliminar esta compra, no hay vuelta atras??")
    .then((confirmed)=>{
      if (confirmed) {
          
        this.buyService.deleteBuy(id).subscribe({
          next:(res)=>{
            this.helping.openSnackBar(res.message,"OK",5000)
          },
          error:(err)=>{
            this.helping.openSnackBar(err.message,"OK",5000)
          }
        })

      } else {}
    });

  }

}
