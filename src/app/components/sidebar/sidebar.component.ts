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
      { name: "customers", displayName: "Overview" },
      { name: "invoices", displayName: "Invoices" },
    ],
    "Retail": [
      { name: "items", displayName: "Products" },
      { name: "retail_items", displayName: "Retail Listings" },
    ],
    "Supplies": [
      { name: "stocked_items", displayName: "Stock" },
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
          {"displayName": "Item Images", "tableName": "retail_item_images"},
          {"displayName": "Allergen Information", "tableName": "allergen_information"},
          {"displayName": "Nutrition Information", "tableName": "nutrition_info"}
          ])
        break;

      case "stocked_items":
        this.dataService.setTabs([
          {"displayName": "Stocked Items", "tableName": "stocked_items"},
          {"displayName": "Supplier Invoices", "tableName": "supplier_invoices"},
          {"displayName": "Suppliers", "tableName": "suppliers"},
          {"displayName": "Warehouses", "tableName": "warehouse"}
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
