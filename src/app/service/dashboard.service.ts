import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError } from 'rxjs';
import { HttpService } from './http.service';
import { enviorement } from '../enviorement/config';
import { DashboardDataGetDTO } from '../models/Dashboard';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  constructor(private http:HttpClient) { }



  getDataDashboard(){
    const endpoint = `${enviorement.api}/admin/dashboard/data`;
    return this.http.get<any>(endpoint).pipe(
      catchError((error: HttpErrorResponse) => HttpService.handleError(error))
    )
    //return response
    //return response.body as DashboardDataGetDTO;
  }
}
