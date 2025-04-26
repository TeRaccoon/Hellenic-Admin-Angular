import { Component } from '@angular/core';
import { DataService } from '../../services/data.service';
import { Router } from '@angular/router';
import { faSpinner, faPrint } from '@fortawesome/free-solid-svg-icons';
import { AuthService } from '../../services/auth.service';
import { FormService } from '../form/service';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { UrlService } from '../../services/url.service';
import { TableOptionsService } from '../../services/table-options.service';
import { PDFService } from '../../services/pdf.service';

@Component({
  selector: 'app-invoice-view',
  templateUrl: './invoice-view.component.html',
  styleUrls: ['./invoice-view.component.scss'],
})
export class InvoiceViewComponent {
  invoiceData: any[] = [];
  invoiceItems: any[] = [];
  deliveryData: any[] = [];
  customerIds: any[] = [];

  faSpinner = faSpinner;
  faPrint = faPrint;

  date = new Date();
  imageUrlBase;

  loaded = false;
  driver = false;

  deliveryOnly = false;

  constructor(
    private formService: FormService,
    private router: Router,
    private dataService: DataService,
    private authService: AuthService,
    private urlService: UrlService,
    private optionsService: TableOptionsService,
    private pdfService: PDFService
  ) {
    this.imageUrlBase = this.urlService.getUrl('uploads');
  }

  ngOnInit() {
    this.loaded = false;
    this.getInvoiceData();
    this.driver = this.authService.getAccessLevel() == 'Driver';
  }

  async getInvoiceData() {
    let error = false;

    var invoiceIds = this.dataService.retrievePrintInvoiceIds();
    if (invoiceIds.length == 0) {
      this.router.navigate(['/view'], { queryParams: { table: 'invoices' } });
      return;
    }

    // Arrays to store invoice and delivery data
    let invoiceData: any[] = [];
    let deliveryData: any[] = [];

    // Retrieve and process data for each invoice
    for (const invoiceId of invoiceIds) {
      const invoiceDataItem: any = await this.dataService.processGet(
        'invoice-info',
        { filter: invoiceId.toString() }
      );
      invoiceData.push({ ...invoiceDataItem, invoice_id: invoiceId });

      const productData: any = await this.dataService.processGet(
        'invoice-products',
        { filter: invoiceId.toString() },
        true
      );
      this.invoiceItems.push(productData);

      let deliveryDataItem: any = await this.dataService.processGet(
        'delivery-info',
        { filter: invoiceId.toString() }
      );

      if (deliveryDataItem.customer_coordinates.length == 0) {
        error = true;
        this.formService.setMessageFormData({
          title: 'Warning!',
          message:
            'There was an issue with one of the postcodes! The distance could not be calculated!',
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

    let combinedData = invoiceData.map((invoice, index) => ({
      invoice,
      delivery: deliveryData[index],
    }));

    this.invoiceData = combinedData.map((item) => item.invoice);
    this.deliveryData = combinedData.map((item) => item.delivery);

    this.sortDistance();

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
          distance: this.optionsService.calculateHaversine(
            currentLocation,
            data.customer_coordinates
          ),
        };
      });
      distances.sort((a: any, b: any) => a.distance - b.distance);
      let nearestDeliveryIndex = distances[0].index;
      let nearestDelivery = tempData.splice(nearestDeliveryIndex, 1)[0];

      sortedDeliveries.push({
        ...nearestDelivery,
        distance: distances[0].distance,
      });

      currentLocation = nearestDelivery.customer_coordinates;
    }

    this.deliveryData = sortedDeliveries;
  }

  calculateVat() {
    this.invoiceData.forEach((invoices: any, index) => {
      var vatTotal = 0;
      this.invoiceItems[index].forEach((item: any) => {
        if (item['vat_charge'] == 'Yes') {
          item['sub_total'] = item['price'] * item['quantity'];
          item['net_total'] =
            (item['sub_total'] * (100 - item['discount'])) / 100;
          item['vat_charge'] = item['net_total'] * 0.2;
          item['total'] = item['net_total'] + item['vat_charge'];
          vatTotal += item['vat_charge'];
        } else {
          item['vat_charge'] = 0;
        }
      });
      invoices['vat'] = vatTotal;
      invoices['discount'] =
        invoices['gross_value'] + invoices['vat'] - invoices['total'];
    });
  }

  async print() {
    this.dataService.retrievePrintInvoiceIds().forEach(async (id: string) => {
      await this.dataService.processGet('set-to-printed', { filter: id });
    });
    window.print();
  }

  async downloadPDF() {
    for (const invoice of this.invoiceData) {
      const data = document.getElementById(invoice.invoice_id);
      if (data) {
        const pdf = await this.pdfService.generatePDF(data);
        pdf.save(`invoice-${invoice.invoice_id}.pdf`);
      }
    }
  }
}
