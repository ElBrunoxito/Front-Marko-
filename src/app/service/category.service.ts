import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { enviorement } from '../enviorement/config';
import { CategoryAddDTO } from '../models/Category';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  constructor(private http:HttpClient) { }

  getAllCategoriesAndUnits(){
    const endpoint = `${enviorement.api}/admin/category/getAll`;
    return this.http.get<any>(endpoint);
  }
  


}
