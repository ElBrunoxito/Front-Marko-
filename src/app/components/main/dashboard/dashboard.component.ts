import { ChangeDetectorRef, Component, effect, inject, OnInit, PLATFORM_ID } from '@angular/core';
import { StorageService } from '../../../interceptors/storage.service';
import ApexCharts from 'apexcharts'
import { ChartModule } from 'primeng/chart';
import { isPlatformBrowser } from '@angular/common';
import { DashboardService } from '../../../service/dashboard.service';
import { OperationsFrontService } from '../../../service/operations-front.service';
import { DashboardDataGetDTO, DateWithPriceDTO } from '../../../models/Dashboard';
import { RouterLink } from '@angular/router';
//import { AppConfigService } from '@/service/appconfigservice';

@Component({
  selector: 'app-dashboard',
  imports: [
    ChartModule,
    RouterLink
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {
  urlImage: string | null = ""
  nameBusiness: string | null = ""
  constructor(
    private storageService: StorageService,
    private cd: ChangeDetectorRef,
    private dashboardService:DashboardService,
    private helping:OperationsFrontService
  ) {

  }

  ngOnInit():void {
    this.urlImage = this.storageService.getUrlImage();
    this.nameBusiness = this.storageService.getNameBusiness();
    this.getDataDashborad();

    

  }

  getDataDashborad(){
    this.dashboardService.getDataDashboard().subscribe({
      next:(res)=>{
        this.dataGet = res.body as DashboardDataGetDTO;
        this.initChart();

      },
      error:(err)=>{
        this.helping.openSnackBar(err.message,"OK",5000)
      }

    })
  }

  dataGet!: DashboardDataGetDTO 



  data: any;
  options: any;
  platformId = inject(PLATFORM_ID);
  /*
      configService = inject(AppConfigService);
  
      designer = inject(DesignerService);
  
  
      themeEffect = effect(() => {
          if (this.configService.transitionComplete()) {
              if (this.designerService.preset()) {
                  this.initChart();
              }
          }
      });
  */



  arrayPost(sales:DateWithPriceDTO[], buys:DateWithPriceDTO[]){

  }


  initChart() {
    if (isPlatformBrowser(this.platformId)) {
      const documentStyle = getComputedStyle(document.documentElement);
      const textColor = documentStyle.getPropertyValue('--p-text-color');
      const textColorSecondary = documentStyle.getPropertyValue('--p-text-muted-color');
      const surfaceBorder = documentStyle.getPropertyValue('--p-content-border-color');
      console.warn(this.dataGet.buys + "dsad")

      const sales : DateWithPriceDTO[] = this.dataGet.sales;
      const buys : DateWithPriceDTO[] = this.dataGet.buys;

      const dates = Array.from(
        new Set([...sales.map(s => s.date), ...buys.map(b => b.date)])
      ).sort();
      
      const salesData = dates.map(date => {
        const sale = sales.find(s => s.date === date);
        return sale ? sale.totalPrice : 0;
      });
      
      const buysData = dates.map(date => {
        const buy = buys.find(b => b.date === date);
        return buy ? buy.totalPrice : 0;
      });


      this.data = {
        labels: dates,
        datasets: [
          {
            label: 'Sales',
            fill: false,
            borderColor: documentStyle.getPropertyValue('--p-cyan-500'),
            yAxisID: 'y',
            tension: 0.4,
            data: salesData
          },
          {
            label: 'Buys',
            fill: false,
            borderColor: documentStyle.getPropertyValue('--p-gray-500'),
            yAxisID: 'y1',
            tension: 0.4,
            data: buysData,
          },
        ]
      };

      this.options = {
        stacked: false,
        maintainAspectRatio: false,
        aspectRatio: 0.6,
        plugins: {
          legend: {
            labels: {
              color: textColor
            }
          }
        },
        scales: {
          x: {
            ticks: {
              color: textColorSecondary
            },
            grid: {
              color: surfaceBorder
            }
          },
          y: {
            type: 'linear',
            display: true,
            position: 'left',
            ticks: {
              color: textColorSecondary
            },
            grid: {
              color: surfaceBorder
            }
          },
          y1: {
            type: 'linear',
            display: true,
            position: 'right',
            ticks: {
              color: textColorSecondary
            },
            grid: {
              drawOnChartArea: false,
              color: surfaceBorder
            }
          }
        }
      };
      this.cd.markForCheck();
    }
  }




}
