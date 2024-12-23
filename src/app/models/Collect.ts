import { UUID } from "angular2-uuid";

/*export interface ViewCollect{
    idSale:UUID;
    countProducts: number;
    descuento:number;
    subTotal:number,
    total:number,
}*/


enum TypeDiscount{
    '%','#'
}

export interface GetCollectDTO{
    idSale:UUID;
    countProducts: number;
    idTypePayment?:number
    descuento?:number;
    subTotal:number;
    total?:number;

    
}


export interface CollectGetDTO{
    idCollect:UUID;
    //countProducts: number;
    idTypePayment?:number
    discount?:number;
    subTotal:number;
    total?:number;
    urlPdf?:string
}



export interface CollectAddDTO {
    idCollection?: UUID; 
    discountAmount?: number; 
    stateCollection: boolean;
    //urlPdf?: string; // Opcional
    idSale: UUID; // UUID en string format
    idTypePayment?: number; // Opcional
}
