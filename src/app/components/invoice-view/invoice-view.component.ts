import { Component } from '@angular/core';
import { DataService } from '../../services/data.service';
import { Router } from '@angular/router';
import { urlBase } from '../../services/data.service';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { lastValueFrom } from 'rxjs';

@Component({
  selector: 'app-invoice-view',
  templateUrl: './invoice-view.component.html',
  styleUrls: ['./invoice-view.component.scss']
})
export class InvoiceViewComponent {
  invoiceData: any[] = [];
  invoiceItems: any[] = [];
  deliveryData: any[] = [];
  customerIds: any[] = [];

  faSpinner = faSpinner;

  date = new Date();
  urlBase = urlBase;

  loaded = false;

  constructor(private router: Router, private dataService: DataService) {}

  ngOnInit() {
    this.loaded = false;
    this.getInvoiceData();
  }

  async getInvoiceData() {
    var invoiceIds = this.dataService.retrievePrintInvoiceIds();
    if (invoiceIds.length == 0) {
      this.router.navigate(['/view'], { queryParams: {table: 'invoices'}});
      return;
    }
    for (const invoiceId of invoiceIds) {
      const invoiceData: any = await lastValueFrom(this.dataService.collectData("invoice-info", invoiceId.toString()));
      this.invoiceData.push(invoiceData);
      
      const productData: any = await lastValueFrom(this.dataService.collectData("invoice-products", invoiceId.toString()));
      this.invoiceItems.push(Array.isArray(productData) ? productData : [productData]);
      
      var deliveryData: any = await lastValueFrom(this.dataService.collectData("delivery-info", invoiceId.toString()));
      deliveryData = this.calculateDistance(deliveryData);
      if (this.customerIds.indexOf(deliveryData.customer_id) == -1) {
        this.deliveryData.push(deliveryData);
        this.customerIds.push(deliveryData.customer_id);
      }
    }
    console.log(this.deliveryData);
    this.calculateVat();
    this.loaded = true;
  }

  calculateDistance(deliveryData: any) {
    deliveryData['distance'] = this.calculateHaversine(deliveryData.customer_coordinates, deliveryData.warehouse_coordinates);
    return deliveryData
  }

  calculateHaversine(coord1: any, coord2: any): string {
    const R = 6371000; // Earth's radius in meters
    const lat1Rad = coord1.latitude * (Math.PI/180);
    const lat2Rad = coord2.latitude * (Math.PI/180);
    const deltaLat = (coord2.latitude - coord1.latitude) * (Math.PI/180);
    const deltaLon = (coord2.longitude - coord1.longitude) * (Math.PI/180);
  
    const a = Math.sin(deltaLat/2) * Math.sin(deltaLat/2) +
              Math.cos(lat1Rad) * Math.cos(lat2Rad) *
              Math.sin(deltaLon/2) * Math.sin(deltaLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  
    const distance = R * c / 1000; // Distance in km
    return distance.toFixed(2);
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
