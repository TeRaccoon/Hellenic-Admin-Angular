import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { faCaretDown, faCaretRight } from '@fortawesome/free-solid-svg-icons';
import { DataService } from '../../services/data.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss'
})
export class SidebarComponent {
  faCaretDown = faCaretDown;
  faCaretRight = faCaretRight;

  tabs: {displayName: string, tableName: string}[] = [];
  
  tables: { [category: string]: any[] } = {
    "Customers": [
      { tableName: "customers", displayName: "Overview" },
      { tableName: "payments", displayName: "Payments"},
      { tableName: "invoices", displayName: "Invoices" },
    ],
    "Products": [
      { tableName: "items", displayName: "Products" },
      { tableName: "allergen_information", displayName: "Allergens" },
      { tableName: "nutrition_info", displayName: "Nutrition" },
    ],
    "Supply": [
      { tableName: "stocked_items", displayName: "Stock" },
      { tableName: "supplier_invoices", displayName: "Invoices" },
      { tableName: "suppliers", displayName: "Suppliers" },
      { tableName: "warehouse", displayName: "Warehouses" },
    ],
    "Finance": [
      { tableName: "invoices", displayName: "Customer Invoices" },
      { tableName: "supplier_invoices", displayName: "Supplier Invoices" },
      { tableName: "general_ledger", displayName: "General Ledger" },
      { tableName: "payments", displayName: "All Payments" },
      { tableName: "profit_loss", displayName: "Profit / Loss" },
      { tableName: "customer_payments", displayName: "Invoice Payments" },
      { tableName: "debtor_creditor", displayName: "Aged Debtor / Creditors"},
    ],
    "Website": [
      { tableName: "offers", displayName: "Offers" },
      { tableName: "statistics", displayName: "Statistics" },
      { tableName: "retail_items", displayName: "Listed Items" },
      { tableName: "discount_codes", displayName: "Discount codes" },
      { tableName: "page_section_text", displayName: "Website Customisation" },
    ]
  };

  isDropdownVisible: { [key: string]: boolean } = {};
  
  constructor(private router: Router, private dataService: DataService) {}

  changeTable(tableName: string) {
    switch (tableName) {
      case "customers":
      case "invoices":
      case "payments":
        this.dataService.setTabs(this.tables['Customers']);
        break;

      case "items":
      case "allergen_information":
      case "nutrition_info":
        this.dataService.setTabs(this.tables['Products']);
        break;

      case "stocked_items":
      case "supplier_invoices":
      case "suppliers":
      case "warehouse":
        this.dataService.setTabs(this.tables['Supply']);
        break;

      case "invoices":
      case "supplier_invoices":
      case "general_ledger":
      case "payments":
      case "customer_payments":
        this.dataService.setTabs(this.tables['Finance']);
        break;
      
      case "discount_codes":
      case "retail_items":
      case "page_section_text":
      case "page_sections":
        this.dataService.setTabs(this.tables['Website']);
          break;

      default:
        this.dataService.setTabs([]);
        break;
    }
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
