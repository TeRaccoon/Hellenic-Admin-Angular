import { Injectable } from '@angular/core';
import { TABLE_NAMES } from '../common/constants';
import { DataService } from './data.service';
import { EXCLUDED_COLUMNS, SearchResult } from '../common/types/table';
import { TableService } from './table.service';

@Injectable({
  providedIn: 'root',
})
export class SearchService {
  constructor(
    private dataService: DataService,
    private tableService: TableService
  ) {}

  async search(filter: string): Promise<SearchResult[]> {
    let filteredData: SearchResult[] = [];

    let tableData = await this.getAllTableData();

    tableData.forEach((table: any[], tableIndex: number) => {
      let results = this.searchTable(table, filter, TABLE_NAMES[tableIndex]);
      if (results.length > 0) {
        filteredData.push(...results);
      }
    });

    return filteredData;
  }

  searchTable(table: any[], filter: string, tableName: string) {
    let filteredData: any[] = [];

    table.forEach((row: any) => {
      let found = this.searchRow(row, filter, tableName);
      if (found) {
        filteredData.push(...found);
      }
    });

    return filteredData;
  }

  searchRow(row: any, filter: string, tableName: string) {
    let matchedData: SearchResult[] = [];
    Object.entries(row).forEach(([key, value]: [string, any]) => {
      if (typeof value === 'string' && value.includes(filter)) {
        let tableDisplayName =
          this.tableService.getTableDisplayName(tableName) ?? '';
        let displayValue = this.processDisplayValue(tableName, value, key, row);

        if (this.shouldDisplayMatch(tableName, key)) {
          matchedData.push({
            tableName: tableDisplayName,
            id: row['id'],
            matchedValue: value,
            displayValue: displayValue,
          });
        }
      }
    });

    return matchedData.length > 0 ? matchedData : null;
  }

  shouldDisplayMatch(tableName: string, key: string) {
    return (
      !(
        tableName in EXCLUDED_COLUMNS &&
        EXCLUDED_COLUMNS[tableName].includes(key)
      ) || !(tableName in EXCLUDED_COLUMNS)
    );
  }

  processDisplayValue(
    tableName: string,
    matchedValue: string,
    key: string,
    row: any
  ) {
    switch (tableName) {
      case 'customers':
        if (key == 'account_number') {
          return `${row['account_name']}: ${matchedValue}`;
        }
        break;
    }

    return matchedValue;
  }

  async getAllTableData() {
    let tableData: any[] = [];

    for (const table of TABLE_NAMES) {
      let data = await this.dataService.processGet(
        'display-data',
        { filter: table },
        true
      );
      tableData.push(data);
    }
    return tableData;
  }
}
