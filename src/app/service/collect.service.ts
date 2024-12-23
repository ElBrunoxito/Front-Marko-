import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CollectAddDTO, CollectGetDTO, GetCollectDTO } from '../models/Collect';
import { enviorement } from '../enviorement/config';
import { catchError, Observable } from 'rxjs';
import { HttpService } from './http.service';
import { UUID } from 'angular2-uuid';

@Injectable({
  providedIn: 'root'
})
export class CollectService {

  constructor(private http:HttpClient) { }


  createCollect(data:CollectAddDTO){
    const endpoint = `${enviorement.api}/user/collect/create`;
    return this.http.post<any>(endpoint,data).pipe(
      catchError((error:HttpErrorResponse)=> HttpService.handleError(error))
    );
  }


  getCollectById(id:UUID){
    const endpoint = `${enviorement.api}/user/collect/getCollectByIdSale/${id}`;
    return this.http.get<any>(endpoint).pipe(
      catchError((error:HttpErrorResponse)=> HttpService.handleError(error))
    );
  }

}
