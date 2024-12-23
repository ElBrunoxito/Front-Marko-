interface GetBusinessSimpleDTO {
    nombreNegocio: string;
    urlImage: string;
}


export interface BusinessDTO {
    id: number; // Equivalente a Long en Java
    name: string;
    description: string;
    ruc: string;
    address: string;
    phone: string;
    urlImage?: string;
    message:string
}


export interface UpdateBusinessDTO {
    id:number
    name: string;
    description: string;
    ruc: string;
    address: string;
    phone: string;
    message: string;
    urlImage: string;
    //file: Fil | null; // Representación de MultipartFile en TypeScript
  }