import { Injectable } from '@angular/core';
import { ReportRequest } from '../models/Report';
import { enviorement } from '../enviorement/config';
import { HttpClient, HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ReportService {

  constructor(private http:HttpClient) { }

  getAll(){
    const endpoint = `${enviorement.api}/admin/report/getAll`;
    return this.http.get<any>(endpoint);
  }

  generateForProduct(data: ReportRequest){
    const endpoint = `${enviorement.api}/admin/report/generateByDates`;
    const params = new HttpParams()
    .set('title',data.title)
    .set('startDate', data.startDate.toISOString().replace('Z', ''))
    .set('endDate', data.endDate.toISOString().replace('Z', ''));
    return this.http.get<any>(endpoint,{params});
  }

}
