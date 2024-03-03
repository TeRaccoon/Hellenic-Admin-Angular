import { Component } from '@angular/core';
import { DataService } from '../../services/data.service';
import { FormService } from '../../services/form.service';
import { FilterService } from '../../services/filter.service';
import { faReceipt, faCircleExclamation, faUserGroup, faUserPlus } from '@fortawesome/free-solid-svg-icons';
import { Router } from '@angular/router';
import { lastValueFrom } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  faReceipt = faReceipt;
  faCircleExclamation = faCircleExclamation;
  faUserGroup = faUserGroup;
  faUserPlus = faUserPlus;
  
  widgetData: any[] = [];
  widgetHeaders = ["Invoices this month", "Invoices due today", "Total customers", "New customers"];
  widgetIcons = [faReceipt, faCircleExclamation, faUserGroup, faUserPlus ]

  invoiceDueData: any[] = [];
  lowStockData: any[] = [];
  productsExpiringData: any[] = [];

  constructor(private formService: FormService, private dataService: DataService, private filterService: FilterService, private router: Router) { }

  ngOnInit() {
    this.loadWidgets();
    this.loadQuickViews();
  }

  async loadWidgets() {
    this.dataService.collectData("total-invoices-month").subscribe((data: any) => {
      this.widgetData.push(data);
    });
    this.dataService.collectData("invoices-due-today").subscribe((data: any) => {
      this.widgetData.push(data);
    });
    this.dataService.collectData("total-customers").subscribe((data: any) => {
      this.widgetData.push(data);
    });
    this.dataService.collectData("new-customers").subscribe((data: any) => {
      this.widgetData.push(data);
    });
  }

  async loadQuickViews() {
    this.getInvoicesDueToday();
    this.getLowStock();
    this.getProductsExpiring();
  }

  async getInvoicesDueToday() {
    let invoiceDueData = await lastValueFrom(this.dataService.collectData("invoices-due-today-basic"));
    this.invoiceDueData = Array.isArray(invoiceDueData) ? invoiceDueData : [invoiceDueData];
  }

  async getLowStock() {
    let lowStockData = await lastValueFrom(this.dataService.collectData("low-stock"));
    this.lowStockData = Array.isArray(lowStockData) ? lowStockData : [lowStockData];
  }

  async getProductsExpiring() {
    let productsExpiringData = await lastValueFrom(this.dataService.collectData("products-expiring-soon"));
    this.productsExpiringData = Array.isArray(productsExpiringData) ? productsExpiringData : [productsExpiringData];
  }

  getObjectKeys(column: any) {
    return Object.keys(column);
  }
}
