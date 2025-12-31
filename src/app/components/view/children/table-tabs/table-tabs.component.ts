import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { DataService } from '../../../../services/data.service';
import { TableDataService } from '../../table-data';

@Component({
  selector: 'app-table-tabs',
  standalone: true,
  imports: [],
  templateUrl: './table-tabs.component.html',
  styleUrl: './table-tabs.component.scss',
})
export class TableTabsComponent {
  constructor(
    private dataService: DataService,
    private router: Router,
    private tableDataService: TableDataService
  ) {}

  get tabs() {
    return this.dataService.Tabs;
  }

  get tableName() {
    return this.tableDataService.tableName;
  }

  changeTab(tableName: string) {
    if (tableName != 'debtor_creditor' && tableName != 'statistics') {
      this.router.navigate(['/view'], { queryParams: { table: tableName } });
    } else if (tableName == 'statistics') {
      this.router.navigate(['/statistics']);
    } else {
      this.router.navigate(['/page'], { queryParams: { table: tableName } });
    }
  }
}
