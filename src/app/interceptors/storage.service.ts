import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  private readonly TOKEN_KEY = 'token';
  private readonly USER = 'user'
  private readonly BUSSINESS = 'bs';
  private readonly URLIMAGE = 'imageUrl'

  //private readonly EXP_TOKEN = 'exp_tkn'
  private readonly ROLES = 'rls';
  private readonly EXPIRATION_DATE = 'exp_dt_tk'


  constructor() { }

  setToken(token: string): void {
    localStorage.setItem(this.TOKEN_KEY, token);
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  dropToken(): void {
    localStorage.removeItem(this.TOKEN_KEY);
  }



  setUser(user: string): void {
    localStorage.setItem(this.USER,user);
  }

  getUser(): string | null{
    return localStorage.getItem(this.USER);
  }

  dropUser(): void {
    localStorage.removeItem(this.USER);
  }



/*
  setDataBusiness(data:BusinessData){
    localStorage.setItem(this.BUSSINESS, );

  }

  getDataBusiness(){

  }

  dropDataBusiness(){

  }
  */



  setRoles(array: any[]): void {
    localStorage.setItem(this.ROLES, JSON.stringify(array));
  }

  getRoles(): any[] {
    const arrayString = localStorage.getItem(this.ROLES);
    return arrayString ? JSON.parse(arrayString):[];
  }

  // Eliminar un array de localStorage
  dropRoles(): void {
    localStorage.removeItem(this.ROLES);
  }


  setExpirationDate(expirationDate:Date):void{
    const expirationDateString = expirationDate.toString();
    localStorage.setItem(this.EXPIRATION_DATE, expirationDateString);
  }
  getExpirationDate():Date | null{
    const expirationDateString = localStorage.getItem(this.EXPIRATION_DATE);
    if (expirationDateString) {
      return new Date(expirationDateString);
    }
    return null;
  }
  dropExpirationDate():void{

    localStorage.removeItem(this.EXPIRATION_DATE)
  } 

  setNameBusiness(name: string): void {
    localStorage.setItem(this.BUSSINESS,name);
  }

  getNameBusiness(): string | null{
    return localStorage.getItem(this.BUSSINESS);
  }

  dropNameBusiness(): void {
    localStorage.removeItem(this.BUSSINESS);
  }

  setUrlImage(url: string): void {
    localStorage.setItem(this.URLIMAGE,url);
  }

  getUrlImage(): string | null{
    return localStorage.getItem(this.URLIMAGE);
  }

  dropUrlImage(): void {
    localStorage.removeItem(this.URLIMAGE);
  }



  dropAll(){
    this.dropToken();
    this.dropRoles();
    this.dropExpirationDate()
    this.dropUser();
  }
  /*
  setAll(res:AuthResponse){
    this.setToken(res.token);
    this.setRoles(res.roles);
    this.setExpirationDate(res.expirationDate)
  }*/
  
}
