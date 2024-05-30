import { Component } from '@angular/core';
import { DataService } from '../../services/data.service';
import { Router } from '@angular/router';
import { imageUrlBase } from '../../services/data.service';
import { faSpinner, faPrint } from '@fortawesome/free-solid-svg-icons';
import { lastValueFrom } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { FormService } from '../../services/form.service';

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
  faPrint = faPrint;

  date = new Date();
  imageUrlBase = imageUrlBase;

  loaded = false;
  driver = false;

  deliveryOnly = false;

  constructor(private formService: FormService, private router: Router, private dataService: DataService, private authService: AuthService) {}

  ngOnInit() {
    this.loaded = false;
    this.getInvoiceData();
    this.driver = this.authService.getAccessLevel() == "Driver";
  }

  async getInvoiceData() {
    let error = false;
    
    var invoiceIds = this.dataService.retrievePrintInvoiceIds();
    if (invoiceIds.length == 0) {
      this.router.navigate(['/view'], { queryParams: {table: 'invoices'}});
      return;
    }

    // Arrays to store invoice and delivery data
    let invoiceData: any[] = [];
    let deliveryData: any[] = [];

    // Retrieve and process data for each invoice
    for (const invoiceId of invoiceIds) {
      const invoiceDataItem: any = await lastValueFrom(this.dataService.processData("invoice-info", invoiceId.toString()));
      invoiceData.push({...invoiceDataItem, invoice_id: invoiceId});
      
      const productData: any = await lastValueFrom(this.dataService.processData("invoice-products", invoiceId.toString()));
      this.invoiceItems.push(Array.isArray(productData) ? productData : [productData]);
      
      let deliveryDataItem: any = await lastValueFrom(this.dataService.processData("delivery-info", invoiceId.toString()));

      if (deliveryDataItem.customer_coordinates.length == 0) {
        error = true;
        this.formService.setMessageFormData({
          title: "Warning!",
          message: "There was an issue with one of the postcodes! The distance could not be calculated!"
        });
      }

      deliveryDataItem['full_address'] = [
        deliveryDataItem.delivery_info[0],
        deliveryDataItem.delivery_info[1],
        deliveryDataItem.delivery_info[2],
        deliveryDataItem.delivery_info[3],
      ].join(' ');

      deliveryData.push(deliveryDataItem);
      this.customerIds.push(deliveryDataItem.customer_id);    
    }
      
    let combinedData = invoiceData.map((invoice, index) => ({ invoice, delivery: deliveryData[index] }));

    this.invoiceData = combinedData.map(item => item.invoice);
    this.deliveryData = combinedData.map(item => item.delivery);

    this.sortDistance()

    this.calculateVat();
    error && this.formService.showMessageForm();
    this.loaded = true;
  }

  sortDistance() {
    let tempData = [...this.deliveryData];
    let sortedDeliveries = [];
    let currentLocation = tempData[0].warehouse_coordinates;
  
    while (tempData.length > 0) {
      let distances = tempData.map((data, index) => {
        return {
          index: index,
          distance: this.calculateDistance(currentLocation, data.customer_coordinates)
        };
      });
  
      distances.sort((a: any, b: any) => a.distance - b.distance);
      let nearestDeliveryIndex = distances[0].index;
      let nearestDelivery = tempData.splice(nearestDeliveryIndex, 1)[0];
      
      sortedDeliveries.push({ ...nearestDelivery, distance: distances[0].distance });
  
      currentLocation = nearestDelivery.customer_coordinates;
    }
  
    this.deliveryData = sortedDeliveries;
  }

  calculateDistance(startLocation: any, endLocation: any) {
    return this.calculateHaversine(startLocation, endLocation);
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

  async print() {
    this.dataService.retrievePrintInvoiceIds().forEach(async (id: string) => {
      await lastValueFrom(this.dataService.processData('set-to-printed', id));
    });
    window.print();
  }
}
