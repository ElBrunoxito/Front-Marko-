export interface ProductsPDFAddDTO {
    cantidad: number;
    description: string;
    price: number;
    total: number;
}

export interface PdfAddDTO {
    urlImage?: string;
    nameBusiness: string;
    addressBusiness: string;
    phoneBusiness: string;
    code: string;
    customer?: string;
    address?: string;
    dateCollect?: Date;
    moneyType?: string;
    products: ProductsPDFAddDTO[];
    total: number; // Asegúrate de que esta línea esté presente
    message?: string;
}
