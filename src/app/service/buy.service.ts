import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { enviorement } from '../enviorement/config';
import { BuyAddDTO, BuyGetDTO, BuyGetDTOWithDetailsGetDTO } from '../models/Buy';
import { catchError } from 'rxjs';
import { HttpService } from './http.service';
import { UUID } from 'angular2-uuid';

@Injectable({
  providedIn: 'root'
})
export class BuyService {

  constructor(private http:HttpClient) { }

  getAll(){
    const endpoint = `${enviorement.api}/admin/buy/getAll`;
    return this.http.get<BuyGetDTO[]>(endpoint); 
  }



  getById(idBuy:any){
    //Tiene que recuperar buy y detials;
    const endpoint = `${enviorement.api}/admin/buy/getBuyWithDetailsById/${idBuy}`;
    return this.http.get<BuyGetDTOWithDetailsGetDTO>(endpoint);
  }

  

  createBuy(data:BuyAddDTO){
    const endpoint = `${enviorement.api}/admin/buy/create`;
    return this.http.post<any>(endpoint,data).pipe(
      catchError((error: HttpErrorResponse) => HttpService.handleError(error))
    );
  }




  updateBuy(data:BuyAddDTO){
    const endpoint = `${enviorement.api}/admin/buy/update`;
    return this.http.put<any>(endpoint,data).pipe(
      catchError((error: HttpErrorResponse) => HttpService.handleError(error))
    );
    
    
    
  }


  deleteBuy(id:UUID){
    const endpoint = `${enviorement.api}/admin/buy/delete/${id}`;
    return this.http.delete<any>(endpoint).pipe(
      catchError((error: HttpErrorResponse) => HttpService.handleError(error))
    );
  }








}
