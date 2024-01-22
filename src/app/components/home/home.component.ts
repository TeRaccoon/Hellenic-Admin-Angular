import { Component } from '@angular/core';
import { DataService } from '../../services/data.service';
import { FormService } from '../../services/form.service';
import { FilterService } from '../../services/filter.service';
import { faReceipt, faCircleExclamation, faUserGroup, faUserPlus } from '@fortawesome/free-solid-svg-icons';
import { Router } from '@angular/router';

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

  constructor(private formService: FormService, private dataService: DataService, private filterService: FilterService, private router: Router) { }

  ngOnInit() {
    this.loadWidgets();
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

  getInvoicesDueToday() {
    this.dataService.collectData("invoices-due-today-ids").subscribe((data: any) => {
      if (data == null) {
        this.formService.setMessageFormData({title: "Information", message: "There are no invoices due to be fulfilled today!"});
        this.formService.showMessageForm();
      } else {
        this.dataService.storePrintInvoiceIds(data);
        this.router.navigate(['/print/invoice']);
      }
    });
  }

  getLowStock() {
    this.dataService.collectData("low-stock").subscribe((data: any) => {
      if (data == null) {
        this.formService.setMessageFormData({title: "Information", message: "There are no products low on stock!"});
      } else {
        this.filterService.setTableFilter("low-stock");
        this.router.navigate(['/view'], { queryParams: {table: 'stocked_items' } });
      }
    });
  }

  getProductsExpiring() {
    this.dataService.collectData("product-expiring-soon").subscribe((data: any) => {
      if (data != null) {
        this.formService.setMessageFormData({title: "Information", message: "There are no products expiring soon!"});
        this.formService.showMessageForm();
      } else {
        this.filterService.setTableFilter("expiring-soon");
        this.router.navigate(['/view'], { queryParams: {table: 'stocked_items' } })
      }
    });
  }
}
