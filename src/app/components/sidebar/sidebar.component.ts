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
      { name: "offers", displayName: "Offers" },
      { name: "page_sections", displayName: "Page Sections" },
      { name: "retail_items", displayName: "Items" }
    ],
    "Invoices": [
      { name: "invoices", displayName: "Invoices" },
      { name: "invoiced_items", displayName: "Invoiced Items" },
    ],
    "Accounting": [
      { name: "general_ledger", displayName: "General Ledger" },
      { name: "debtor_creditor", displayName: "Aged Debtors/ Creditors" },
      { name: "profit_loss", displayName: "Profit Loss" }
    ],
    "Admin": [
      { name: "statistics", displayName: "Statistics" }
    ]
  };

  isDropdownVisible: { [key: string]: boolean } = {};
  
  constructor(private router: Router) {}

  changeTable(tableName: string) {
    if (tableName != "debtor_creditor" && tableName != "profit_loss" && tableName != "statistics") {
      this.router.navigate(['/view'], { queryParams: {table: tableName } });
    } else if (tableName == "statistics") {
      this.router.navigate(['/statistics'])
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
