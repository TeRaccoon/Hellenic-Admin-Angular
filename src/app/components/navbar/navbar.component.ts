import { Component } from '@angular/core';
import { faSearch, faBell, faEnvelope, faUser } from '@fortawesome/free-solid-svg-icons';
import { DataService } from '../../services/data.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent {
  faBell = faBell;
  faEnvelope = faEnvelope;
  faUser = faUser;
  faSearch = faSearch;

  dropDownVisible = false;

  notifications: { header: string; data: any[] }[] = [];

  constructor(private dataService: DataService) {}

  ngOnInit() {
    this.getNotifications();
  }

  toggleNotificationDropdown() {
    this.dropDownVisible = !this.dropDownVisible;
  }

  getNotifications() {
    this.dataService.collectData('invoices-due', '1').subscribe((data: any) => {
      if (data.length != 0) {
        var invoicesDue = data;
        if (!Array.isArray(invoicesDue)) {
          invoicesDue = [invoicesDue];
        }
        var invoiceDataArray: any[] = [];
        invoicesDue.forEach((invoiceData: any) => {
          invoiceDataArray.push(`Invoice: ${ invoiceData.title }`)
        });
        this.notifications.push({ header: 'Invoices Due Today', data: invoiceDataArray });
      }
    });
  }
}
