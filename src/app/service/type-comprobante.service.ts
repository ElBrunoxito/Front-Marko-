import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { enviorement } from '../enviorement/config';
import { catchError, map } from 'rxjs';
import { HttpService } from './http.service';

@Injectable({
  providedIn: 'root'
})
export class TypeComprobanteService {

  constructor(private http:HttpClient) { }

  getAll(){
    const endpoint = `${enviorement.api}/user/typeMovement/getAll`;
    return this.http.get<any>(endpoint).pipe(
      map(data=>{
        if(data.body && Array.isArray(data.body)){
          data.body = data.body.reverse()
        }
        return data;
      })
    ).pipe(
      catchError((error: HttpErrorResponse) => HttpService.handleError(error))
    );
  }
}
