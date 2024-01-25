import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class FilterService {
  private tableFilter: string | null = null;
  private columnFilter: { column: string, filter: string } | null = null
  private tableColumns: { columnNames: { [key: string]: any }[], columns: string[] } = {
    columnNames: [],
    columns: [],
  };

  setColumnFilter(columnFilter: { column: string, filter: string }) {
    this.columnFilter = columnFilter;
  }
  getColumnFilter() {
    return this.columnFilter;
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
    this.columnFilter = null;
  }

  setTableColumns(columnNames: { [key: string]: any }[], columns: string[]) {
    this.tableColumns = {columnNames, columns};
  }

  getTableColumns() {
    return this.tableColumns;
  }
}
