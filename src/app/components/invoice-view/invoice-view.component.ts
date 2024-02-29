import { Component } from '@angular/core';
import { DataService } from '../../services/data.service';
import { Router } from '@angular/router';
import { urlBase } from '../../services/data.service';

@Component({
  selector: 'app-invoice-view',
  templateUrl: './invoice-view.component.html',
  styleUrls: ['./invoice-view.component.scss']
})
export class InvoiceViewComponent {
  invoiceData: any[] = [];
  invoiceItems: any[] = [];
  date = new Date();
  urlBase = urlBase;

  constructor(private router: Router, private dataService: DataService) {}

  ngOnInit() {
    this.getInvoiceData();
  }

  getInvoiceData() {
    var invoiceIds = this.dataService.retrievePrintInvoiceIds();
    if (invoiceIds.length == 0) {
      this.router.navigate(['/view'], { queryParams: {table: 'invoices'}});
    }
    invoiceIds.forEach(invoiceId => {
      this.dataService.collectData("invoice-info", invoiceId.toString()).subscribe((data: any) => {
        this.invoiceData.push(data);
      });
      this.dataService.collectData("invoice-products", invoiceId.toString()).subscribe((data: any) => {
        this.invoiceItems.push(Array.isArray(data) ? data : [data]);
        this.calculateVat();
      });
    });
  }

  calculateVat() {
    this.invoiceData.forEach((invoices: any, index) => {
      var vatTotal = 0;
      this.invoiceItems[index].forEach((item: any) => {
        if (item['vat_charge'] == 'Yes') {
          var vatAmount = item['quantity'] * item['price'] * 0.2;
          item['vat_charge'] = vatAmount;
          vatTotal += vatAmount;
        } else {
          item['vat_charge'] = 0;
        }
      });
      invoices['vat'] = vatTotal;
    });
  }
}
