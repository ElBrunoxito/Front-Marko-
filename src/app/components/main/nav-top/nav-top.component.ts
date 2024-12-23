import { NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { StorageService } from '../../../interceptors/storage.service';

@Component({
  selector: 'app-nav-top',
  standalone: true,
  imports: [
    NgIf
  ],
  templateUrl: './nav-top.component.html',
  styleUrl: './nav-top.component.scss'
})
export class NavTopComponent implements OnInit{
  isMenuOpen: boolean = false; // Controla el estado del menú
  username!:string
  constructor(
    private storageService:StorageService
  ){}

  ngOnInit(): void {
    this.getUser();
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
