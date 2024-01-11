import { Component } from '@angular/core';
import { DataService } from '../../services/data.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-invoice-view',
  templateUrl: './invoice-view.component.html',
  styleUrls: ['./invoice-view.component.scss']
})
export class InvoiceViewComponent {
  invoiceData: any[] = [];
  invoiceItems: any[] = [];
  date = new Date();

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
        this.invoiceItems.push(data);
        console.log(this.invoiceItems);
      });
    });
  }
}
