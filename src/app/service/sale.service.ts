import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { enviorement } from '../enviorement/config';
import { SaleAddDTO, SaleGetDTO, SaleGetDTOWithDetailsGetDTO } from '../models/Sale';
import { catchError, filter, map } from 'rxjs';
import { HttpService } from './http.service';
import { UUID } from 'angular2-uuid';

@Injectable({
  providedIn: 'root'
})
export class SaleService {

  constructor(private http:HttpClient) { }

  getAll(){
    const endpoint = `${enviorement.api}/user/sale/getAll`;
    return this.http.get<SaleGetDTO[]>(endpoint).pipe(
      map((data) => 
        data.map(item => ({
          ...item,
          cobrado: item.cobrado?true:false
        }))
    )

    ); 
  }



  getById(idSale:any){
    //Tiene que recuperar buy y detials;}
    //user/sale/getSaleWithDetailsById
    const endpoint = `${enviorement.api}/user/sale/getSaleWithDetailsById/${idSale}`;
    return this.http.get<any>(endpoint);
  }

  

  createSale(data:SaleAddDTO){
    const endpoint = `${enviorement.api}/user/sale/create`;
    return this.http.post<any>(endpoint,data).pipe(
      catchError((error: HttpErrorResponse) => HttpService.handleError(error))
    );
  }




  updateSale(data:SaleAddDTO){
    const endpoint = `${enviorement.api}/admin/sale/update`;
    return this.http.put<any>(endpoint,data).pipe(
      catchError((error: HttpErrorResponse) => HttpService.handleError(error))
    );
    
    
    
  }


  generateUrlPdf(idSale:UUID){
    const endpoint = `${enviorement.api}/user/collect/generatePdf/${idSale}`;
    return this.http.get<any>(endpoint)
    

  }



}
