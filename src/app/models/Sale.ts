import { UUID } from "angular2-uuid";
import { ProductGetUserDTO } from "./Products";


export interface SaleGetDTO {
    idSale: UUID;
    code: string;
    saleUpdateDate: Date;
    saleTotal: number;
    descuento: number;
    total: number;
    cobrado: boolean;
    typePayment: string;
    user: string;
    urlPdf:string;

  }
  
export interface SaleGetSimpleDTO {
    idSale:UUID;
    code: string

}



 export interface SaleGetDTOWithDetailsGetDTO {
    idSale: UUID;
    code: string;
    saleUpdateDate: string;
    saleTotal: number;
    idTypeComprobante: number;
    idCollection: UUID;
    saleDetails: DetailSaleGetDTO[];
  }


//Agregar y actualizar
export interface SaleAddDTO {
    idSale?: UUID;
    idTypeComprobante: number;
    detailsSale: DetailSaleAddDTO[]; 
}

export interface DetailSaleAddDTO {
    idDetailSale?: UUID;
    description?: string;
    quantity: number;
    price: number;
    idProduct: UUID;
}



export interface ViewDetailsSaleDTO{
    id:UUID
    description:string
    quantity:number
    price:number
    idProduct: UUID; 
}

//GETTERS
export interface DetailSaleGetDTO {
    idDetailSale: UUID; 
    quantity: number; 
    price: number;
    product: ProductGetUserDTO;
}

