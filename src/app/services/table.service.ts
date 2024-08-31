import { Injectable } from '@angular/core';
import { REVERSE_TABLE_NAME_MAP, TABLE_NAME_MAP, TABLE_CATEGORIES } from '../common/constants';
import { DataService } from './data.service';
import { AuthService } from './auth.service';
import { FormService } from './form.service';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';

@Injectable({
    providedIn: 'root',
})

export class TableService {
    private selectedTable = new BehaviorSubject<string>('');

    constructor(private router: Router, private authService: AuthService, private formService: FormService, private dataService: DataService) { }

    getSelectedTable() {
        return this.selectedTable.asObservable();
    }

    setSelectedTable(table: string) {
        this.selectedTable.next(table);
    }

    getTableDisplayName(tableName: string) {
        return TABLE_NAME_MAP.get(tableName);
    }

    getTableName(displayName: string) {
        return REVERSE_TABLE_NAME_MAP.get(displayName);
    }

    changeTable(table: string) {
        if (!this.authService.queryAccessTable(table)) {
            this.formService.setMessageFormData({ title: "Warning!", message: "You don't have permission to access this page! If you think you should, contact the site administrator." });
            this.formService.showMessageForm();
            return;
        }

        this.setSelectedTable(table);
        console.log(table);
        switch (table) {
            case "customers":
            case "invoices":
            case "payments":
            case "price_list":
                this.dataService.setTabs(TABLE_CATEGORIES['Customers']);
                break;

            case "items":
                this.dataService.setTabs(TABLE_CATEGORIES['Products']);
                break;

            case "stocked_items":
            case "supplier_invoices":
            case "suppliers":
            case "warehouse":
                this.dataService.setTabs(TABLE_CATEGORIES['Supply']);
                break;

            case "general_ledger":
            case "payments":
            case "customer_payments":
                this.dataService.setTabs(TABLE_CATEGORIES['Finance']);
                break;

            case "discount_codes":
            case "retail_items":
            case "page_section_text":
            case "image_locations":
            case "page_sections":
            case "offers":
            case "categories":
            case "sub_categories":
                this.dataService.setTabs(TABLE_CATEGORIES['Website']);
                break;

            default:
                this.dataService.setTabs([]);
                break;
        }
        if (table != "debtor_creditor" && table != "profit_loss" && table != "statistics" && table != "settings" && table != "vat-returns") {
            this.router.navigate(['/view'], { queryParams: { table: table } });
        } else if (table == "statistics") {
            this.router.navigate(['/statistics']);
        } else if (table == "settings") {
            this.router.navigate(['/settings']);
        } else {
            this.router.navigate(['/page'], { queryParams: { table: table } });
        }
    }


}