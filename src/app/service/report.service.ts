import { Injectable } from '@angular/core';
import { CreateReportGenerateProductDTO, GetViewReportDTO } from '../models/Report';
import { enviorement } from '../enviorement/config';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ReportService {

  constructor(private http:HttpClient) { }

  getAll(){
    const endpoint = `${enviorement.api}/admin/report/getAll`;
    return this.http.get<GetViewReportDTO[]>(endpoint);
  }

  generateForProduct(data: CreateReportGenerateProductDTO){
    const endpoint = `${enviorement.api}/admin/report/generate`;
    return this.http.post<any>(endpoint,data);
  }

}
