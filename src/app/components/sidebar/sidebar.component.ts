import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { faCaretDown, faCaretRight } from '@fortawesome/free-solid-svg-icons';
import { AuthService } from '../../services/auth.service';
import { TableService } from '../../services/table.service';
import { TABLE_CATEGORIES } from '../../common/constants';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss'
})
export class SidebarComponent {
  faCaretDown = faCaretDown;
  faCaretRight = faCaretRight;

  tabs: { displayName: string, tableName: string }[] = [];

  selectedTable: string | null = null;

  isDropdownVisible: { [key: string]: boolean } = {};

  tables: any = TABLE_CATEGORIES;

  constructor(route: ActivatedRoute, private router: Router, private tableService: TableService, private authService: AuthService) {
    route.queryParams.subscribe(params => {
      if (params['table'] != null) {
        this.selectedTable = params['table'];
      }
    });

    tableService.getSelectedTable().subscribe((table: string) => {
      this.selectedTable = table;
    })
  }

  canDisplayTable(tableName: string) {
    return this.authService.queryAccessTable(tableName, false);
  }

  changeTable(tableName: string) {
    this.tableService.changeTable(tableName);
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
