import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ProductAddDTO, ProductGet, ProductGetAdminDTO, ProductGetUserDTO } from '../models/Products';
import { enviorement } from '../enviorement/config';
import { catchError, filter, map, Observable, throwError } from 'rxjs';
import { ErrorDTO } from '../models/Response';
import { HttpService } from './http.service';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  constructor(private http:HttpClient) { }



  getAll():Observable<ProductGet[]>{
    const endpoint = `${enviorement.api}/admin/product/getAll`;
    return this.http.get<ProductGet[]>(endpoint).pipe(
      map((products:ProductGet[]) =>{
        return products.map(p=>({
          ...p,
          state: p.state ? 'ACTIVO':'INACTIVO'
        }))
      })
    ); 

  }

  //Simple
  getAllForUser(){
    const endpoint = `${enviorement.api}/user/product/getAll`;
    return this.http.get<ProductGetUserDTO[]>(endpoint); 


    
  }


  getByIdForUser(id:any){
    const endpoint = `${enviorement.api}/user/product/${id}`;
    return this.http.get<ProductGet>(endpoint)
  }

  getByIdForAdmin(id:any){
    const endpoint = `${enviorement.api}/admin/product/${id}`;
    return this.http.get<ProductGetAdminDTO>(endpoint)
  }








  add(data:ProductAddDTO){
    const endpoint = `${enviorement.api}/admin/product/create`;
    return this.http.post<any>(endpoint,data).pipe(
      catchError((error: HttpErrorResponse) => HttpService.handleError(error))
    );
  }

  update(data:ProductAddDTO){
    const endpoint = `${enviorement.api}/admin/product/update`;
    return this.http.put<any>(endpoint,data).pipe(  
      catchError((error:HttpErrorResponse)=> HttpService.handleError(error))
    )
  }








}
