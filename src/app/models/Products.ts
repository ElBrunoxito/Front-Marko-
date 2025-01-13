import { UUID } from "angular2-uuid";
import { CategoryAddDTO } from "./Category";


export interface ProductGet {
  idProduct: string; // UUID se representa como string en TypeScript
  barCode: string;
  description: string;
  unit: string;
  initialStock: number; // Long se mapea como number

  priceBuy: number; // Double se mapea como number
  priceSale: number;

  minStock: number;
  maxStock: number;

  currentStock: number;

  category: string;
  //state: boolean;
  state: string; // Boolean se mapea como boolean
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
  priceBuy?:number
  priceSale?:number
  minStock?:number
  maxStock?:number

  categoryAddFast: CategoryAddDTO;  // Asumiendo que esta interfaz también existe
  unitAddFast: UnitAddDTO;
}




export interface ProductGetAdminDTO {
  idProduct: string; // UUID se representa como string en TypeScript
  barCode: string;
  description: string;
  initialStock: number; // Long en Java se mapea a number en TypeScript

  priceBuy: number; // Double en Java se mapea a number en TypeScript
  priceSale: number;
  minStock: number;
  maxStock: number;

  category: string;
  unit: string;
}
export interface ProductGetUserDTO {
  idProduct: string; // UUID se r epresenta como string en TypeScript
  barCode: string;
  description: string;
  priceBuy: number; // Double se mapea como number
  priceSale: number;
}
