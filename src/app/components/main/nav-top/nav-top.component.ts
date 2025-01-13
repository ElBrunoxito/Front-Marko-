import { NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { StorageService } from '../../../interceptors/storage.service';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';
import { MAIN_ROUTE_NAME } from '../routes.name';

@Component({
    selector: 'app-nav-top',
    imports: [
        NgIf
    ],
    templateUrl: './nav-top.component.html',
    styleUrl: './nav-top.component.scss'
})
export class NavTopComponent implements OnInit{
  isMenuOpen: boolean = false; // Controla el estado del menú
  username!:string

  currentPage:string = "--"
  constructor(
    private storageService:StorageService,
    private router:Router
  ){}

  ngOnInit(): void {
    this.getUser();
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.updateCurrentPage();
    });
    this.updateCurrentPage();

  }
  updateCurrentPage() {
    const currentRoute = this.router.url;

    const routeWithoutMain = currentRoute.replace('/main', '') as keyof typeof MAIN_ROUTE_NAME;

    // Buscar el texto en el diccionario de rutas
    this.currentPage = MAIN_ROUTE_NAME[routeWithoutMain] || 'Página desconocida';
  }


  getUser(){
    this.username =  this.storageService.getUser()??'User';
  }


  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen; // Cambia el estado del menú
  }

  closeMenu() {
    this.isMenuOpen = false; // Cierra el menú
  }


  logout(){
    this.storageService.dropAll();
    window.location.reload();
  }
}
