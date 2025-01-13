import { UUID } from "angular2-uuid";
/*
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
  */
  export interface GetReportDTO {
    id: number; // UUID como string
    title: string;
    creationDate: Date; // Tipo Date para manejar fechas
    startDate: Date; // Tipo Date para manejar fechas
    endDate: Date; // Tipo Date para manejar fechas
    urlPdf: string;
    user: string;
}

  
  ////////////////////////////
  export interface ReportRequest {
    title:string
    startDate:Date;  // Formato de fecha: 'YYYY-MM-DD'
    endDate: Date;    // Formato de fecha: 'YYYY-MM-DD'
  }
  

