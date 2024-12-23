import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { enviorement } from '../enviorement/config';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http:HttpClient) {
    
  }


  login(data:any){
    const endpoint = `${enviorement.api}/auth/login`;
    return this.http.post(endpoint,data); 
  }


  registerNewUser(data:any){
    const endpoint = `${enviorement.api}/admin/register`;
    return this.http.post(endpoint,data); 

  }
}
