import { Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { REVERSE_TABLE_NAME_MAP, TABLE_CATEGORIES, TABLE_NAME_MAP } from '../common/constants';
import { FormService } from '../components/form/service';
import { AuthService } from './auth.service';
import { DataService } from './data.service';

@Injectable({
  providedIn: 'root',
})
export class TableService {
  private selectedTable = signal<string>('');

  constructor(
    private router: Router,
    private authService: AuthService,
    private formService: FormService,
    private dataService: DataService
  ) {}

  getSelectedTable() {
    return this.selectedTable();
  }

  setSelectedTable(table: string) {
    this.selectedTable.set(table);
  }

  getTableDisplayName(tableName: string) {
    return TABLE_NAME_MAP.get(tableName) ?? '';
  }

  getTableName(displayName: string) {
    return REVERSE_TABLE_NAME_MAP.get(displayName);
  }

  changeTable(table: string) {
    if (!this.authService.queryAccessTable(table)) {
      this.formService.setMessageFormData({
        title: 'Warning!',
        message:
          "You don't have permission to access this page! If you think you should, contact the site administrator.",
      });
      return;
    }

    if (this.selectedTable() == table) {
      this.formService.requestReload('hard');
    }

    this.setSelectedTable(table);
    switch (table) {
      case 'customers':
      case 'invoices':
      case 'price_list':
      case 'credit_notes_customers':
        this.dataService.setTabs(TABLE_CATEGORIES['Customers']);
        break;

      case 'items':
      case 'stocked_items':
      case 'invoiced_items':
        this.dataService.setTabs(TABLE_CATEGORIES['Products']);
        break;

      case 'supplier_invoices':
      case 'credit_notes':
      case 'suppliers':
      case 'supplier_types':
      case 'warehouse':
      case 'expired_items':
        this.dataService.setTabs(TABLE_CATEGORIES['Supply']);
        break;

      case 'general_ledger':
      case 'payments':
      case 'customer_payments':
      case 'supplier_payments':
      case 'expense_options':
        this.dataService.setTabs(TABLE_CATEGORIES['Finance']);
        break;

      case 'page_section_text':
      case 'image_locations':
      case 'page_sections':
      case 'offers':
      case 'categories':
      case 'sub_categories':
        this.dataService.setTabs(TABLE_CATEGORIES['Website']);
        break;

      default:
        this.dataService.setTabs([]);
        break;
    }
    if (
      table != 'debtor_creditor' &&
      table != 'profit-loss' &&
      table != 'statistics' &&
      table != 'settings' &&
      table != 'vat-returns'
    ) {
      this.router.navigate(['/view'], { queryParams: { table: table } });
    } else if (table == 'statistics') {
      this.router.navigate(['/statistics']);
    } else if (table == 'settings') {
      this.router.navigate(['/settings']);
    } else if (table == 'profit-loss') {
      this.router.navigate(['/print/profit-loss']);
    } else {
      this.router.navigate(['/page'], { queryParams: { table: table } });
    }
  }
}
