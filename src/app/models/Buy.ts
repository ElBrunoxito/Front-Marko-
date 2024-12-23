import { UUID } from "angular2-uuid";
import { ProductGetUserDTO } from "./Products";

export interface BuyGetDTO {
    idBuy: UUID; 
    nroBuy: string;
    buyUpdateDate: Date|string; 
    typeComprobante: string; 
    buyTotal: number;
}


export interface BuyGetDTOWithDetailsGetDTO {
    idBuy: UUID; // Identificador único de la compra
    nroBuy: string; // Número de la compra
    buyUpdateDate: Date; // Fecha y hora de actualización de la compra
    buyTotal: number; // Total de la compra
    idTypeComprobante: number; // Identificador del tipo de comprobante
    buys: DetailBuyGetDTO[]; // Lista de detalles de la compra
}


//Agregar y actualizar
export interface BuyAddDTO {
    idBuy?: UUID; 
    nroBuy: string; 
    idTypeComprobante: number; 
    detailsBuy: DetailBuyAddDTO[]; 
}




//Details
export interface DetailBuyAddDTO {
    idDetailBuy?: UUID; 
    description?: string;
    quantity: number; 
    price: number; 
    dueDate: Date;
    idProduct: UUID; 
}

export interface ViewDetailsDTO{
    id:UUID
    description:string
    dueDate:Date
    quantity:number
    price:number
    idProduct: UUID; 
}



//GETTERS
export interface DetailBuyGetDTO {
    idDetailBuy: UUID; 
    quantity: number; 
    price: number;
    dueDate: Date; 
    product: ProductGetUserDTO;
}




