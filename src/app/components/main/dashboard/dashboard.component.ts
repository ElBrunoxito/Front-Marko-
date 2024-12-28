import { Component, OnInit } from '@angular/core';
import { StorageService } from '../../../interceptors/storage.service';
import ApexCharts from 'apexcharts'

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit{
  urlImage:string|null = ""
  nameBusiness:string|null = ""
  constructor(
    private storageService:StorageService
  ){

  }

  ngOnInit(): void {
    this.urlImage = this.storageService.getUrlImage();
    this.nameBusiness = this.storageService.getNameBusiness();
  }
}
