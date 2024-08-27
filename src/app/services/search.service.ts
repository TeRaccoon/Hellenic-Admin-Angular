import { Injectable } from '@angular/core';
import { TABLE_NAMES } from '../common/constants';
import { DataService } from './data.service';
import { SearchResult } from '../common/types/table';
import { TableService } from './table.service';

@Injectable({
  providedIn: 'root',
})

export class SearchService {

  constructor(private dataService: DataService, private tableService: TableService) { }

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
    let matchedData: any[] = [];

    Object.entries(row).forEach(([key, value]: [string, any]) => {
      if (typeof value === 'string' && value.includes(filter)) {
        matchedData.push({
          tableName: this.tableService.getTableDisplayName(tableName),
          id: row['id'],
          matchedValue: value
        });
      }
    });

    return matchedData.length > 0 ? matchedData : null;
  }

  async getAllTableData() {
    let tableData: any[] = [];

    for (const table of TABLE_NAMES) {
      let data = await this.dataService.processGet('display-data', { filter: table }, true);
      tableData.push(data);
    }
    return tableData;
  }
}