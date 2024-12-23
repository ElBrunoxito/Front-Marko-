import { UUID } from "angular2-uuid";

export interface GetViewReportDTO {
    idReport: string; 
    title: string;
    creation: Date; 
    rangoDate: string;
}

export interface CreateReportGenerateProductDTO {
    title: string;
    idProduct: UUID; 
    idCategory: number;
    typeFilter: number;
    startDate: Date; 
    endDate: Date;
}



///TYPE1
export interface GetSalesDataForReportDTO {
    data: string;
    quantity: number;
    price: number;
  }
  
  export interface GenerateReportGetDTO {
    typeEncabezado: string;
    creationDate: string;
    startReport: string;  
    endReport: string;
    quantityBuy: number;
    totalBuy: number;
    salesData: GetSalesDataForReportDTO[];
    totalSales: number;
    sumDiscounts: number;
    margen: number;
  }
  
  

