import { Injectable } from '@angular/core';
import { FilterData } from '../common/types/view/types';

@Injectable({
  providedIn: 'root',
})
export class FilterService {
  private tableFilter: string | null = null;
  private columnFilter: { column: string, filter: string, caseSensitive: boolean }[] = [];
  private columnDateFilter: { column: string, startDate: Date, endDate: Date }[] = [];
  private tableColumns: { columnNames: { [key: string]: any }[], columns: string[], dataTypes: string[] } = {
    columnNames: [],
    columns: [],
    dataTypes: [],
  };

  private filterData: FilterData;
  private protectFilterData = false;

  constructor() {
    this.filterData = {
      searchFilter: '',
      searchFilterApplied: false,
    }
  }

  setFilterData(filterData: FilterData) {
    if (!this.protectFilterData) {
      this.filterData = filterData;
    } else {
      this.protectFilterData = false;
    }
  }

  getFilterData(): FilterData {
    return this.filterData;
  }

  setFilterProtection(protect: boolean) {
    this.protectFilterData = protect;
  }

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
    if (this.columnDateFilter && this.columnDateFilter.length > 0) {
      this.columnDateFilter.push(columnDateFilter);
    } else {
      this.columnDateFilter = [columnDateFilter];
    }
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
      this.columnFilter = this.columnFilter.filter((filter: any) => filter.filter != columnFilter);
    }
  }

  removeColumnDateFilter(columnDateFilter: { column: string, startDate: Date, endDate: Date }) {
    if (columnDateFilter) {
      this.columnDateFilter = this.columnDateFilter.filter((filter: any) => filter != columnDateFilter);
    }
  }

  clearColumnDateFilter() {
    this.columnDateFilter = [];
  }

  setTableColumns(columnNames: { [key: string]: any }[], columns: string[], dataTypes: string[]) {
    this.tableColumns = { columnNames, columns, dataTypes };
  }

  getTableColumns() {
    return this.tableColumns;
  }
}
