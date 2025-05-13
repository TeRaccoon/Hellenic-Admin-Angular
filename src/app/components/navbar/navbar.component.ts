import { Component, ElementRef, HostListener, OnInit, Renderer2, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import _ from 'lodash';
import { NAVBAR_ICONS } from '../../common/icons/navbar-icons';
import { SearchResult } from '../../common/types/table';
import { AuthService } from '../../services/auth.service';
import { DataService } from '../../services/data.service';
import { FilterService } from '../../services/filter.service';
import { SearchService } from '../../services/search.service';
import { TableService } from '../../services/table.service';
import { FormService } from '../form/service';
import { FormType } from '../form/types';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
})
export class NavbarComponent implements OnInit {
  @ViewChild('notificationDropdown') notificationDropdown!: ElementRef;
  @ViewChild('notificationIcon') notificationIcon!: ElementRef;

  @ViewChild('userOptions') userOptions!: ElementRef;
  @ViewChild('userIcon') userIcon!: ElementRef;

  icons = NAVBAR_ICONS;

  debounceSearch: (filter: string) => void = _.debounce((filter: string) => this.performSearch(filter), 750);

  tablelessOptions: string[] = [];
  tableOptions = [
    { display: 'Allergen Information', actual: 'allergen_information' },
    { display: 'Customer Address', actual: 'customer_address' },
    { display: 'Customer Payments', actual: 'customer_payments' },
    { display: 'Customers', actual: 'customers' },
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
    { display: 'Retail Users', actual: 'retail_users' },
    { display: 'Stocked Items', actual: 'stocked_items' },
    { display: 'Supplier Invoices', actual: 'supplier_invoices' },
    { display: 'Suppliers', actual: 'suppliers' },
    { display: 'Users', actual: 'users' },
    { display: 'Warehouse', actual: 'warehouse' },
  ];
  filteredTableOptions = this.tableOptions;
  searchResults: SearchResult[] = [];

  searching = false;

  searchInput = '';

  notificationVisible = false;
  userOptionsVisible = false;
  searchDropdownVisible = false;
  searchDropdownFocus = false;

  notifications: { header: string; data: any[] }[] = [];

  constructor(
    private tableService: TableService,
    private filterService: FilterService,
    private searchService: SearchService,
    private dataService: DataService,
    private router: Router,
    private authService: AuthService,
    private formService: FormService,
    private renderer: Renderer2
  ) {
    this.renderer.listen('window', 'click', (e: Event) => {
      const notificationClicked = this.notificationDropdown?.nativeElement.contains(e.target);

      const bellClicked =
        this.notificationIcon.nativeElement.contains(e.target) ||
        (this.notificationIcon.nativeElement.querySelector('svg') &&
          this.notificationIcon.nativeElement.querySelector('svg').contains(e.target));

      if (!notificationClicked && !bellClicked) {
        this.notificationVisible = false;
      }

      const userOptionsClicked = this.userOptions?.nativeElement.contains(e.target);

      const userClicked =
        this.userIcon.nativeElement.contains(e.target) ||
        (this.userIcon.nativeElement.querySelector('svg') &&
          this.userIcon.nativeElement.querySelector('svg').contains(e.target));

      if (!userOptionsClicked && !userClicked) {
        this.userOptionsVisible = false;
      }
    });
  }

  ngOnInit() {
    this.debounceSearch = _.debounce(this.performSearch.bind(this), 750);
  }

  toggleNotificationDropdown() {
    this.userOptionsVisible = false;
    this.notificationVisible = !this.notificationVisible;
  }

  toggleUserOptions() {
    this.notificationVisible = false;
    this.userOptionsVisible = !this.userOptionsVisible;
  }

  async getNotifications() {
    const invoicesDue = await this.dataService.processGet('invoices-due', { filter: '1' }, true);

    if (invoicesDue.length != 0) {
      const invoiceDataArray: any[] = [];
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
    this.searching = true;
    const filter = String((event.target as HTMLInputElement).value);
    this.filteredTableOptions = this.tableOptions.filter(
      (option) => option.display && option.display.toUpperCase().includes(filter.toUpperCase())
    );
    this.debounceSearch(filter);
  }

  async performSearch(filter: string) {
    if (filter != '') {
      this.searchResults = await this.searchService.search(filter);
    } else {
      this.searchResults = [];
    }

    this.searchDropdownVisible = true;
    this.searching = false;
  }

  changeTable(table: string) {
    this.searchDropdownFocus = false;
    this.searchDropdownVisible = false;
    this.tableService.changeTable(table);
  }

  goToRow(table: string, matchedValue: string) {
    this.filterService.setFilterData({
      searchFilter: matchedValue,
      searchFilterApplied: true,
    });

    this.filterService.setFilterProtection(true);
    this.tableService.changeTable(this.tableService.getTableName(table) ?? '');

    this.searchDropdownVisible = false;
  }

  async logout() {
    this.userOptionsVisible = false;

    const logoutResponse = await this.authService.logout();
    if (logoutResponse) {
      this.router.navigate(['/login']);
      return;
    }

    this.formService.setMessageFormData({
      title: 'Whoops!',
      message: 'Something went wrong! Please try again',
    });
  }

  changePassword() {
    this.userOptionsVisible = false;
    this.formService.setFormVisibility(FormType.ChangePassword, true);
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
