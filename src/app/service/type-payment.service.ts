import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { enviorement } from '../enviorement/config';

@Injectable({
  providedIn: 'root'
})
export class TypePaymentService {

  constructor(private http:HttpClient) { }



  getAll(){
    const endpoint = `${enviorement.api}/user/typePayment/getAll`;
    return this.http.get<any>(endpoint);
  }
}
