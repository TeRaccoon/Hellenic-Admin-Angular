import { Component, HostListener } from '@angular/core';
import {
  faSearch,
  faBell,
  faEnvelope,
  faUser,
  faFileCircleXmark
} from '@fortawesome/free-solid-svg-icons';
import { DataService } from '../../services/data.service';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { FormService } from '../../services/form.service';
import { lastValueFrom } from 'rxjs';

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
  faFileCircleXmark = faFileCircleXmark

  tablelessOptions: string[] = [];
  tableOptions = [
    { display: 'Allergen Information', actual: 'allergen_information' },
    { display: 'Customer Address', actual: 'customer_address' },
    { display: 'Customer Payments', actual: 'customer_payments' },
    { display: 'Customers', actual: 'customers' },
    { display: 'Discount Codes', actual: 'discount_codes' },
    { display: 'Expired Items', actual: 'expired_items' },
    { display: 'General Ledger', actual: 'general_ledger' },
    { display: 'Image Locations', actual: 'image_locations' },
    { display: 'Interest Charges', actual: 'interest_charges' },
    { display: 'Invoiced Items', actual: 'invoiced_items' },
    { display: 'Invoices', actual: 'invoices' },
    { display: 'Items', actual: 'items' },
    { display: 'Nutrition Information', actual: 'nutrition_info' },
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
  searchDropdownVisible = false;
  searchDropdownFocus = false;

  notifications: { header: string; data: any[] }[] = [];

  constructor(private dataService: DataService, private router: Router, private authService: AuthService, private formService: FormService) {}

  ngOnInit() {
    // this.getNotifications();
  }

  toggleNotificationDropdown() {
    this.userOptionsVisible = false;
    this.dropDownVisible = !this.dropDownVisible;
  }

  toggleUserOptions() {
    this.dropDownVisible = false;
    this.userOptionsVisible = !this.userOptionsVisible;
  }

  async getNotifications() {
    let invoicesDue = await lastValueFrom(this.dataService.processData('invoices-due', '1'));

    if (invoicesDue.length != 0) {
      invoicesDue = Array.isArray(invoicesDue) ? [invoicesDue] : invoicesDue;

      var invoiceDataArray: any[] = [];
      invoicesDue.forEach((invoiceData: any) => {
        invoiceDataArray.push(`Invoice: ${invoiceData.title}`);
      });
      
      this.notifications.push({
        header: 'Invoices Due Today',
        data: invoiceDataArray,
      });
    }
  }

  searchTables(event: Event) {
    const filter = String((event.target as HTMLInputElement).value);
    this.filteredTableOptions = this.tableOptions.filter((option) => option.display && option.display.toUpperCase().includes(filter.toUpperCase()));
  }

  changeTable(table: string) {
    this.searchDropdownFocus = true;
    this.router.navigate(['/view'], { queryParams: {table: table } });
    this.searchDropdownVisible = false;
  }

  async logout() {
    this.userOptionsVisible = false;

    const logoutResponse = await this.authService.logout();
    if (logoutResponse) {
      this.router.navigate(['/login']);
      return;
    }

    this.formService.setMessageFormData({ title: "Whoops!", message: "Something went wrong! Please try again" });
    this.formService.showMessageForm();
  }

  changePassword() {
    this.userOptionsVisible = false;
    this.formService.showChangePasswordForm();
  }

  @HostListener('document:click', ['$event'])
  clickOutside(event: MouseEvent) {
    const clickedElement = event.target as HTMLElement;
    if (!this.isDescendantOfSearchContainer(clickedElement)) {
      this.searchDropdownVisible = false;
    }
  }

  private isDescendantOfSearchContainer(element: HTMLElement): boolean {
    let currentElement: HTMLElement | null = element;
    while (currentElement) {
      if (currentElement.classList.contains('search-container')) {
        return true;
      }
      currentElement = currentElement?.parentElement;
    }
    return false;
  }
}
