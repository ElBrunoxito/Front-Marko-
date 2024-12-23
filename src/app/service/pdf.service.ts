import { Injectable } from '@angular/core';
import { jsPDF } from 'jspdf';
import { PdfAddDTO } from '../models/PDF';
import { enviorement } from '../enviorement/config';
import { HttpClient } from '@angular/common/http';
import { GenerateReportGetDTO } from '../models/Report';
import pdfFonts from 'pdfmake/build/vfs_fonts';

@Injectable({
  providedIn: 'root'
})
export class PdfService {

  constructor(private http:HttpClient) { }

  generatePDF(data: PdfAddDTO):any {
    const pdf = new jsPDF();

    // Agregar imagen si existe
    if (data.urlImage) {
      pdf.addImage(data.urlImage, 'JPEG', 15, 15, 154, 50); // Ajusta la posición y tamaño según sea necesario
    }

    // Agregar encabezados
    pdf.setFontSize(18);
    pdf.text(data.nameBusiness, 15, 70);
    pdf.setFontSize(12);
    pdf.text(data.addressBusiness, 15, 80);
    pdf.text(`Tel: ${data.phoneBusiness}`, 15, 90);
    pdf.text(`Código: ${data.code}`, 15, 100);
    pdf.text(`Cliente: ${data.customer}`, 15, 110);
    pdf.text(`Dirección: ${data.address}`, 15, 120);
    pdf.text(`Fecha: ${this.formatDate(data.dateCollect)}`, 15, 130);
    pdf.text(`Moneda: ${data.moneyType}`, 15, 140);

    // Agregar tabla de productos
    const startY = 150;
    const rowHeight = 10;
    pdf.setFontSize(10);
    pdf.text("Cantidad", 15, startY);
    pdf.text("Descripción", 45, startY);
    pdf.text("Precio", 145, startY);
    pdf.text("Total", 175, startY);
    
    let y = startY + rowHeight;
    data.products.forEach(product => {
      pdf.text(product.cantidad.toString(), 15, y);
      pdf.text(product.description, 45, y);
      pdf.text(product.price.toFixed(2), 145, y);
      pdf.text(product.total.toFixed(2), 175, y);
      y += rowHeight;
    });

    // Agregar total
    pdf.setFontSize(12);
    pdf.text(`Total a Pagar: ${data.total.toFixed(2)}`, 15, y + 10);
    if (data.message) {
      pdf.text(data.message, 15, y + 20);
    }

    // Convertir a Blob
    const pdfBlob = pdf.output('blob');
    return pdfBlob; 

    // Guardar el PDF
    // pdf.save('document.pdf');
  }

  private formatDate(date?: Date): string {
    if (!date) return '';
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: '2-digit', day: '2-digit' };
    return new Date(date).toLocaleDateString(undefined, options);
  }





  getPDFBACKEND(){
    const endpoint = `${enviorement.api}/auth/pdf/get`;
    return this.http.get<any>(endpoint);
  }







  generatePDFType1(reportData: GenerateReportGetDTO){
    return {
      content: [
        {
          text: 'REPORTE',
          bold: true,
          fontSize: 20,
          alignment: 'center',
          margin: [0, 0, 0, 20]
        },
        {
          text: reportData.typeEncabezado,
          style: 'header'
        },
        {
          columns: [
            [
              { text: 'Fecha de creación: ' + reportData.creationDate, style: 'infoText' },
              { text: 'Fecha de inicio: ' + reportData.startReport, style: 'infoText' },
              { text: 'Fecha de fin: ' + reportData.endReport, style: 'infoText' }
            ]
          ]
        },
        {
          text: 'Resumen de Compras y Ventas',
          style: 'header'
        },
        {
          columns: [
            { text: 'Cantidad Comprada: ' + reportData.quantityBuy, style: 'infoText' },
            { text: 'Total de Compras: ' + reportData.totalBuy.toFixed(2), style: 'infoText' }
          ]
        },
        {
          columns: [
            { text: 'Total de Ventas: ' + reportData.totalSales.toFixed(2), style: 'infoText' },
            { text: 'Suma de Descuentos: ' + reportData.sumDiscounts.toFixed(2), style: 'infoText' },
            { text: 'Margen: ' + reportData.margen.toFixed(2), style: 'infoText' }
          ]
        },
        {
          text: 'Datos de Ventas',
          style: 'header',
          margin: [0, 20, 0, 10]
        },
        {
          table: {
            headerRows: 1,
            widths: ['*', 'auto', 'auto', 'auto'],
            body: [
              // Encabezados de la tabla
              [
                { text: 'Data', style: 'tableHeader' },
                { text: 'Cantidad', style: 'tableHeader' },
                { text: 'Precio', style: 'tableHeader' },
                { text: 'Total (Cantidad x Precio)', style: 'tableHeader' }
              ],
              // Datos de la tabla
              ...reportData.salesData.map(sale => [
                sale.data,
                sale.quantity,
                sale.price.toFixed(2),
                (sale.quantity * sale.price).toFixed(2)
              ])
            ]
          }
        }
      ],
      info: {
        title: reportData.typeEncabezado + '_REPORTE',
        author: 'Generador de Reportes',
        subject: 'Reporte de Inventario',
        keywords: 'REPORTE, INVENTARIO'
      },
      styles: {
        header: {
          fontSize: 18,
          bold: true,
          margin: [0, 20, 0, 10],
          decoration: 'underline'
        },
        infoText: {
          fontSize: 12,
          margin: [0, 5, 0, 5]
        },
        tableHeader: {
          bold: true,
          fontSize: 13,
          color: 'black'
        }
      }
    };
    
  }
}
