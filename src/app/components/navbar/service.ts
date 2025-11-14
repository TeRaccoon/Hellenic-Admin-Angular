import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Customers, Invoices } from '../../common/types/tables';
import { AuthService } from '../../services/auth.service';
import { DataService } from '../../services/data.service';
import { FilterService } from '../../services/filter.service';
import { TableService } from '../../services/table.service';
import { FormService } from '../form/service';

@Injectable({
  providedIn: 'root',
})
export class NavbarService {
  constructor(
    private authService: AuthService,
    private dataService: DataService,
    private filterService: FilterService,
    private formService: FormService,
    private router: Router,
    private tableService: TableService
  ) {}

  isDescendantOfSearchContainer(element: HTMLElement): boolean {
    let currentElement: HTMLElement | null = element;
    while (currentElement) {
      if (currentElement.classList.contains('search-container')) {
        return true;
      }
      currentElement = currentElement?.parentElement;
    }
    return false;
  }

  async logout() {
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

  async getPendingCustomers() {
    return ((await this.dataService.processGet('pending-customers', {}, true)) as Customers[]).map(
      (c) => `${c.id} - ${c.account_name}`
    );
  }

  async getNewInvoices() {
    return ((await this.dataService.processGet('all-invoices', {}, true)) as Invoices[])
      .filter((i) => i.created_at && this.isToday(i.created_at))
      .map((i) => `${i.title} - Delivery date: ${i.delivery_date}`);
  }

  isToday(date: Date): boolean {
    const d = new Date(date);
    const today = new Date();

    return (
      d.getFullYear() === today.getFullYear() && d.getMonth() === today.getMonth() && d.getDate() === today.getDate()
    );
  }

  goToRow(table: string, matchedValue: string) {
    this.filterService.setFilterData({
      searchFilter: matchedValue,
      searchFilterApplied: true,
    });

    this.filterService.setFilterProtection(true);
    this.tableService.changeTable(this.tableService.getTableName(table) ?? '');
  }
}
