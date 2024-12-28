import { UUID } from "angular2-uuid";
import { CategoryAddDTO } from "./Category";

export interface ProductGet {
  idProduct: string;         // UUID se representa como string en TS
  barCode: string;
  description: string;
  unit: string;
  initialStock:number
  price:number
  currentStock: number;      // Long en Java se convierte en number en TS
  category: string;
  //state: boolean;
  state:string
}


export interface UnitAddDTO {
  id?: number;  // Cambiado de Integer a number (TypeScript no tiene Integer como tipo)
  name: string;
}


export interface ProductAddDTO {
  idProduct?: string;       
  barCode: string;
  description: string;
  initialStock?: number;     // Valor por defecto de 0 en tu clase Java
  price:number;
  categoryAddFast: CategoryAddDTO;  // Asumiendo que esta interfaz también existe
  unitAddFast: UnitAddDTO;
}



export interface ProductGetAdminDTO{
  idProduct: string;  // UUID as string
  barCode: string;
  description: string;
  initialStock: number;
  price:number
  category: string;
  unit: string;
}


export interface ProductGetUserDTO{
  idProduct: UUID;  // UUID as string
  barCode: string;
  description: string;
  price:number
}
