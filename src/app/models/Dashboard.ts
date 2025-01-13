export interface DateWithPriceDTO {
    totalPrice: number; // Equivalente a Double en Java
    date: Date;         // Equivalente a Date en Java
}
  
export interface DashboardDataGetDTO {
    // Buy
    moneyTodayBuy: number;      // Equivalente a Double
    totalBuyWeek: number;       // Equivalente a Double
  
    // Sale
    cashTodaySale: number;          // Equivalente a Double
    moneyYapeTodaySale: number;     // Equivalente a Double
    totalSale: number;              // Equivalente a Double
    totalSaleWeek: number;          // Equivalente a Double
  
    // Grafico sales and buys
    sales: DateWithPriceDTO[];  // Lista de objetos DateWithPriceDTO
    buys: DateWithPriceDTO[];   // Lista de objetos DateWithPriceDTO
  
    // Otros datos
    totalProducts: number;    // Equivalente a Long
    totalCategories: number;  // Equivalente a Long
    totalUnits: number;       // Equivalente a Long
  }