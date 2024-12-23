import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { enviorement } from '../enviorement/config';
import { UpdateBusinessDTO } from '../models/business';

@Injectable({
  providedIn: 'root'
})
export class BusinessService {

  constructor(private http:HttpClient) { }

  getDataBusinessUser(){
    const endpoint = `${enviorement.api}/user/business/getBusiness`;
    return this.http.get<any>(endpoint); 
  }

  

  getDataBusinessAdmin(){
    const endpoint = `${enviorement.api}/admin/business/getBusiness`;
    return this.http.get<any>(endpoint); 
  }


  getUserAndRoles(){
    const endpoint = `${enviorement.api}/admin/business/getUserRoles`;
    return this.http.get<any>(endpoint); 
  }




  updateBusiness(data:UpdateBusinessDTO, img:any){
    const endpoint = `${enviorement.api}/admin/business/update`;

    const formData = new FormData();
    console.warn(data)
    formData.append('file', img); 
    formData.append('data', JSON.stringify(data))

    console.warn(formData)
    return this.http.put<any>(endpoint, formData );

  }
}
