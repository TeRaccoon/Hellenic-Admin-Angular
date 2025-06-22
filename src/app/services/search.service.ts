import { Injectable } from '@angular/core';
import { TABLE_NAMES } from '../common/constants';
import { EXCLUDED_COLUMNS, SearchResult } from '../common/types/table';
import { DataService } from './data.service';
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
    const filteredData: SearchResult[] = [];

    const tableData = await this.getAllTableData();

    tableData.forEach((table: any[], tableIndex: number) => {
      const results = this.searchTable(table, filter, TABLE_NAMES[tableIndex]);
      if (results.length > 0) {
        filteredData.push(...results);
      }
    });

    return filteredData;
  }

  searchTable(table: any[], filter: string, tableName: string) {
    for (const row of table) {
      const found = this.searchRow(row, filter, tableName);
      if (found) {
        return found;
      }
    }

    return [];
  }

  searchRow(row: any, filter: string, tableName: string) {
    const matchedData: SearchResult[] = [];
    Object.entries(row).forEach(([key, value]: [string, any]) => {
      if (typeof value === 'string' && value.includes(filter)) {
        const tableDisplayName = this.tableService.getTableDisplayName(tableName) ?? '';
        const displayValue = this.processDisplayValue(tableName, value, key, row);

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
      !(tableName in EXCLUDED_COLUMNS && EXCLUDED_COLUMNS[tableName].includes(key)) || !(tableName in EXCLUDED_COLUMNS)
    );
  }

  processDisplayValue(tableName: string, matchedValue: string, key: string, row: any) {
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
    const tableData: any[] = [];

    for (const table of TABLE_NAMES) {
      const data = await this.dataService.processGet('display-data', { filter: table }, true);
      tableData.push(data);
    }
    return tableData;
  }
}
