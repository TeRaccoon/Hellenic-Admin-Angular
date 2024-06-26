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
    
    let data = await lastValueFrom(this.dataService.processData("total-invoices-month"))
    this.widgetData.push(data);

    data = await lastValueFrom(this.dataService.processData("invoices-due-today"))
    this.widgetData.push(data);

    data = await lastValueFrom(this.dataService.processData("total-customers"))
    this.widgetData.push(data);

    data = await lastValueFrom(this.dataService.processData("new-customers"))
    this.widgetData.push(data);
  }

  async loadQuickViews() {
    this.getInvoicesDueToday();
    this.getLowStock();
    this.getProductsExpiring();
  }

  async getInvoicesDueToday() {
    let invoiceDueData = await lastValueFrom(this.dataService.processData("invoices-due-today-basic"));
    this.invoiceDueData = Array.isArray(invoiceDueData) ? invoiceDueData : [invoiceDueData];
  }

  async getLowStock() {
    let lowStockData = await lastValueFrom(this.dataService.processData("low-stock"));
    this.lowStockData = Array.isArray(lowStockData) ? lowStockData : [lowStockData];
  }

  async getProductsExpiring() {
    let productsExpiringData = await lastValueFrom(this.dataService.processData("products-expiring-soon"));
    this.productsExpiringData = Array.isArray(productsExpiringData) ? productsExpiringData : [productsExpiringData];
  }

  getObjectKeys(column: any) {
    return Object.keys(column);
  }
}
