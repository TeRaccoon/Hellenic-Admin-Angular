import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { faCaretDown } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss'
})
export class SidebarComponent {
  faCaretDown = faCaretDown;
  
  tables: { [category: string]: any[] } = {
    "Customers": [
      { name: "customer_address", displayName: "Addresses" },
      { name: "customers", displayName: "Details" },
      { name: "customer_payments", displayName: "Payments" },
    ],
    "Retail": [
      { name: "invoices", displayName: "Invoices" },
      { name: "offers", displayName: "Offers" },
      { name: "page_sections", displayName: "Page Sections" },
      { name: "retail_items", displayName: "Items" }
    ],
    "Accounting": [
      { name: "general_ledger", displayName: "General Ledger" },
      { name: "debtor_creditor", displayName: "Aged Debtors/ Creditors" },
      { name: "profit_loss", displayName: "Profit Loss" }
    ]
  };

  isDropdownVisible: { [key: string]: boolean } = {};
  
  constructor(private router: Router) {}

  changeTable(tableName: string) {
    if (tableName != "debtor_creditor" && tableName != "profit_loss") {
      this.router.navigate(['/view'], { queryParams: {table: tableName } });
    } else {
      this.router.navigate(['/page'], { queryParams: {table: tableName } });
    }
  }

  getTableCategories(obj: { [key: string]: any }): string[] {
    return obj ? Object.keys(obj) : [];
  }

  toggleDropdown(category: string): void {
    this.isDropdownVisible[category] = !this.isDropdownVisible[category];
  }

  goHome() {
    this.router.navigate(['/home']);
  }
}
