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
      { name: "discount_codes", displayName: "Discount Codes" },
      { name: "page_sections", displayName: "Page Sections" },
      { name: "page_section_text", displayName: "Page Section Text"},
      { name: "retail_items", displayName: "Items" },
      { name: "retail_item_images", displayName: "Item Images" },
    ],
    "Supplies": [
      { name: "stocked_items", displayNames: "Stocked Items" },
      { name: "supplier_invoices", displayNames: "Supplier Invoices" },
      { name: "suppliers", displayNames: "Suppliers" },
    ],
    "Products": [
      { name: "items", displayName: "Items" },
      { name: "allergen_information", displayName: "Allergen Information" },
      { name: "nutrition_information", displayName: "Nutrition Information" },
    ],
    "Invoices": [
      { name: "invoices", displayName: "Invoices" },
      { name: "invoiced_items", displayName: "Invoiced Items" },
    ],
    "Accounting": [
      { name: "general_ledger", displayName: "General Ledger" },
      { name: "debtor_creditor", displayName: "Aged Debtors/ Creditors" },
      { name: "profit_loss", displayName: "Profit Loss" },
      { name: "payments", displayName: "Payments" },
    ],
    "Admin": [
      { name: "statistics", displayName: "Statistics" },
      { name: "image_locations", displayName: "Image Location" },
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
