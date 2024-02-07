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
      { name: "customers", displayName: "Details" },
      { name: "invoices", displayName: "Invoices" },
    ],
    "Retail": [
      { name: "items", displayName: "Products" },
      { name: "offers", displayName: "Offers" },
      { name: "discount_codes", displayName: "Discount Codes" },
      { name: "page_sections", displayName: "Page Sections" },
      { name: "page_section_text", displayName: "Page Section Text"},
      { name: "retail_items", displayName: "Items" },
      { name: "retail_item_images", displayName: "Item Images" },
    ],
    "Supplies": [
      { name: "stocked_items", displayName: "Stocked Items" },
      { name: "supplier_invoices", displayName: "Supplier Invoices" },
      { name: "suppliers", displayName: "Suppliers" },
    ],
    "Products": [
      { name: "items", displayName: "Items" },
      { name: "allergen_information", displayName: "Allergen Information" },
      { name: "nutrition_info", displayName: "Nutrition Information" },
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
      { name: "users", displayName: "Users" },
    ]
  };

  isDropdownVisible: { [key: string]: boolean } = {};
  
  constructor(private router: Router, private dataService: DataService) {}

  changeTable(tableName: string) {
    switch (tableName) {
      case "customers":
      case "invoices":
        this.dataService.setTabs([
          {"displayName": "Addresses", "tableName": "customer_address"},
          {"displayName": "Details", "tableName": "customers"},
          {"displayName": "Payments", "tableName": "customer_payments"},
          {"displayName": "Invoices", "tableName": "invoices"},
          {"displayName": "Invoiced Items", "tableName": "invoiced_items"}
          ])
        break;

      case "items":
      case "retail_items":
        this.dataService.setTabs([
          {"displayName": "Products", "tableName": "items"},
          {"displayName": "Offers", "tableName": "offers"},
          {"displayName": "Discount Codes", "tableName": "discount_codes"},
          {"displayName": "Page Sections", "tableName": "page_sections"},
          {"displayName": "Page Section Text", "tableName": "page_section_text"},
          {"displayName": "Items", "tableName": "retail_items"},
          {"displayName": "Item Images", "tableName": "retail_item_images"}
      ])
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
