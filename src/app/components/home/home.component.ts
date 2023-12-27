import { Component } from '@angular/core';
import { DataService } from '../../services/data.service';
import { faReceipt, faCircleExclamation, faUserGroup, faUserPlus } from '@fortawesome/free-solid-svg-icons';

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

  constructor(private dataService: DataService) { }

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
    })
  }
}
