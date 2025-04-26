import { Injectable } from "@angular/core";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

@Injectable({
  providedIn: 'root',
})
export class PDFService {
  generatePDF(data: HTMLElement): Promise<jsPDF> {
    return new Promise((resolve) => {
      html2canvas(data, { useCORS: true, allowTaint: true })
        .then((canvas) => {
          const imgWidth = 210.5;
          const pageHeight = 295;
          const imgHeight = (canvas.height * imgWidth) / canvas.width;
          let heightLeft = imgHeight;

          const pdf = new jsPDF('p', 'mm', 'a4');
          let position = 0;

          const imgData = canvas.toDataURL('image/png');
          pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
          heightLeft -= pageHeight;

          while (heightLeft >= 0) {
            position = heightLeft - imgHeight;
            pdf.addPage();
            pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
            heightLeft -= pageHeight;
          }

          return resolve(pdf);
        })
    });
  }
}