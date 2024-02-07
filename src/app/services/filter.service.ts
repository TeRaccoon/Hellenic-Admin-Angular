import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class FilterService {
  private tableFilter: string | null = null;
  private columnFilter: { column: string, filter: string, caseSensitive: boolean }[] = [];
  private columnDateFilter: { column: string, startDate: Date, endDate: Date } | null = null;
  private tableColumns: { columnNames: { [key: string]: any }[], columns: string[], dataTypes: string[] } = {
    columnNames: [],
    columns: [],
    dataTypes: [],
  };

  setColumnFilter(columnFilter: { column: string, filter: string, caseSensitive: boolean }) {
    if (this.columnFilter && this.columnFilter.length > 0) {
      this.columnFilter.push(columnFilter);
    } else {
      this.columnFilter = [columnFilter];
    }
  }
  getColumnFilter() {
    return this.columnFilter;
  }

  setColumnDateFilter(columnDateFilter: { column: string, startDate: Date, endDate: Date }) {
    this.columnDateFilter = columnDateFilter;
  }

  getColumnDateFilter() {
    return this.columnDateFilter;
  }

  setTableFilter(filter: string) {
    this.tableFilter = filter;
  }

  getTableFilter() {
    return this.tableFilter;
  }

  clearFilter() {
    this.tableFilter = null;
  }

  clearColumnFilter() {
    this.columnFilter = [];
  }

  removeColumnFilter(columnFilter: string) {
    if (this.columnFilter) {
      console.log(this.columnFilter);
      this.columnFilter = this.columnFilter.filter((filter: any) => filter.filter != columnFilter);
      console.log(this.columnFilter);
    }
  }

  clearColumnDateFilter() {
    this.columnDateFilter = null;
  }

  setTableColumns(columnNames: { [key: string]: any }[], columns: string[], dataTypes: string[]) {
    this.tableColumns = {columnNames, columns, dataTypes};
  }

  getTableColumns() {
    return this.tableColumns;
  }
}
