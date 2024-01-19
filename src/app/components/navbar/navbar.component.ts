import { Component } from '@angular/core';
import {
  faSearch,
  faBell,
  faEnvelope,
  faUser,
} from '@fortawesome/free-solid-svg-icons';
import { DataService } from '../../services/data.service';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
})
export class NavbarComponent {
  faBell = faBell;
  faEnvelope = faEnvelope;
  faUser = faUser;
  faSearch = faSearch;
  tablelessOptions: string[] = [];
  tableOptions = [
    { display: 'Allergen Information', actual: 'allergen_information' },
    { display: 'Customer Address', actual: 'customer_address' },
    { display: 'Customer Payments', actual: 'customer_payments' },
    { display: 'Customers', actual: 'customers' },
    { display: 'Discount Codes', actual: 'discount_codes' },
    { display: 'General Ledger', actual: 'general_ledger' },
    { display: 'Image Locations', actual: 'image_locations' },
    { display: 'Interest Charges', actual: 'interest_charges' },
    { display: 'Invoiced Items', actual: 'invoiced_items' },
    { display: 'Invoices', actual: 'invoices' },
    { display: 'Items', actual: 'items' },
    { display: 'Nutrition Information', actual: 'nutrition_information' },
    { display: 'Offers', actual: 'offers' },
    { display: 'Page Section Text', actual: 'page_section_text' },
    { display: 'Page Sections', actual: 'page_sections' },
    { display: 'Payments', actual: 'payments' },
    { display: 'Retail Item Images', actual: 'retail_item_images' },
    { display: 'Retail Items', actual: 'retail_items' },
    { display: 'Retail Users', actual: 'retail_users' },
    { display: 'Stocked Items', actual: 'stocked_items' },
    { display: 'Supplier Invoices', actual: 'supplier_invoices' },
    { display: 'Suppliers', actual: 'suppliers' },
    { display: 'Users', actual: 'users' },
    { display: 'Warehouse', actual: 'warehouse' }
  ];
  filteredTableOptions = this.tableOptions;

  searchInput: string = '';

  dropDownVisible = false;
  userOptionsVisible = false;

  notifications: { header: string; data: any[] }[] = [];

  constructor(private dataService: DataService, private router: Router, private authService: AuthService) {}

  ngOnInit() {
    this.getNotifications();
  }

  toggleNotificationDropdown() {
    this.dropDownVisible = !this.dropDownVisible;
  }

  toggleUserOptions() {
    this.userOptionsVisible = !this.userOptionsVisible;
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
          invoiceDataArray.push(`Invoice: ${invoiceData.title}`);
        });
        this.notifications.push({
          header: 'Invoices Due Today',
          data: invoiceDataArray,
        });
      }
    });
  }

  searchTables(event: Event) {
    const filter = String((event.target as HTMLInputElement).value);
    this.filteredTableOptions = this.tableOptions.filter((option) => option.display && option.display.toUpperCase().includes(filter.toUpperCase()));
    console.log(this.filteredTableOptions);
  }

  changeTable(table: string) {
    this.router.navigate(['/view'], { queryParams: {table: table } });
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
