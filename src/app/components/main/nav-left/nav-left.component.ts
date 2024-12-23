import { NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { BusinessService } from '../../../service/business.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-nav-left',
  standalone: true,
  imports: [
    MatIconModule,
    RouterLink
  ],
  templateUrl: './nav-left.component.html',
  styleUrl: './nav-left.component.scss'
})
export class NavLeftComponent implements OnInit {

  nombre:string = ""
  urlImage:string = ""

  minimize:boolean = false;


  constructor(
    private businessService:BusinessService,
    
  ){

  }

  ngOnInit(): void {
    this.getDataBusiness();
  }

  minimizar(){
    this.minimize = !this.minimize;


  }


  getDataBusiness(){
    this.businessService.getDataBusinessUser().subscribe({
      next:(res)=>{
        this.nombre = res.nombreNegocio;
        this.urlImage = res.urlImage
      },
      error:(err)=>{
        this.nombre = "null";
        this.urlImage = "null"
      }

    })

  }


}
