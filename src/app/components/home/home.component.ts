import { Component } from '@angular/core';
import { DataService } from '../../services/data.service';
import {
  faReceipt,
  faCircleExclamation,
  faUserGroup,
  faUserPlus,
} from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent {
  faReceipt = faReceipt;
  faCircleExclamation = faCircleExclamation;
  faUserGroup = faUserGroup;
  faUserPlus = faUserPlus;

  widgetData: any[] = [];
  widgetHeaders = [
    'Invoices this month',
    'Invoices due today',
    'Total customers',
    'New customers',
  ];
  widgetIcons = [faReceipt, faCircleExclamation, faUserGroup, faUserPlus];

  invoiceDueData: any[] = [];
  lowStockData: any[] = [];
  productsExpiringData: any[] = [];

  constructor(private dataService: DataService) {}

  ngOnInit() {
    this.loadWidgets();
    this.loadQuickViews();
  }

  async loadWidgets() {
    let data = await this.dataService.processGet('total-invoices-month');
    this.widgetData.push(data);

    data = await this.dataService.processGet('invoices-due-today');
    this.widgetData.push(data);

    data = await this.dataService.processGet('total-customers');
    this.widgetData.push(data);

    data = await this.dataService.processGet('new-customers');
    this.widgetData.push(data);
  }

  async loadQuickViews() {
    this.getInvoicesDueToday();
    this.getLowStock();
    this.getProductsExpiring();
  }

  async getInvoicesDueToday() {
    this.invoiceDueData = await this.dataService.processGet(
      'invoices-due-today-basic',
      undefined,
      true
    );
  }

  async getLowStock() {
    this.lowStockData = await this.dataService.processGet(
      'low-stock',
      undefined,
      true
    );
  }

  async getProductsExpiring() {
    this.productsExpiringData = await this.dataService.processGet(
      'products-expiring-soon',
      undefined,
      true
    );
  }

  getObjectKeys(column: any) {
    return Object.keys(column);
  }
}
