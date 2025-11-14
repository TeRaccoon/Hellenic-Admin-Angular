import { Injectable } from '@angular/core';
import { TableName, TableTypeMap } from '../common/types/tables';
import { FilterData } from '../common/types/view/types';
import { TableColumns } from '../components/filter-form/types';
import { ViewService } from '../components/view/service';
import { ColumnDateFilter, SortedColumn } from '../components/view/types';

@Injectable({
  providedIn: 'root',
})
export class FilterService {
  private tableFilter: string | null = null;
  private columnFilter: {
    column: string;
    filter: string;
    caseSensitive: boolean;
  }[] = [];

  private columnDateFilter: {
    column: string;
    startDate: Date;
    endDate: Date;
  }[] = [];

  private tableColumns: TableColumns = {
    columnNames: [],
    columns: null,
    dataTypes: [],
  };

  private filterData: FilterData;
  private protectFilterData = false;

  constructor(private viewService: ViewService) {
    this.filterData = {
      searchFilter: '',
      searchFilterApplied: false,
    };
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

  setColumnFilter(columnFilter: { column: string; filter: string; caseSensitive: boolean }) {
    if (this.columnFilter && this.columnFilter.length > 0) {
      this.columnFilter.push(columnFilter);
    } else {
      this.columnFilter = [columnFilter];
    }
  }
  getColumnFilter() {
    return this.columnFilter;
  }

  setColumnDateFilter(columnDateFilter: { column: string; startDate: Date; endDate: Date }) {
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

  removeColumnDateFilter(columnDateFilter: { column: string; startDate: Date; endDate: Date }) {
    if (columnDateFilter) {
      this.columnDateFilter = this.columnDateFilter.filter((filter: any) => filter != columnDateFilter);
    }
  }

  clearColumnDateFilter() {
    this.columnDateFilter = [];
  }

  setTableColumns(columnNames: string[], columns: TableTypeMap[TableName], dataTypes: string[]) {
    this.tableColumns = { columnNames, columns, dataTypes };
  }

  getTableColumns(): TableColumns {
    return this.tableColumns;
  }

  applyTemporaryFilter() {
    const temporaryData: Record<string, unknown>[] = [];
    if (this.getFilterData().searchFilter != '') {
      this.viewService.displayData.forEach((data) => {
        if (this.objectValuesContains(data)) {
          temporaryData.push(data);
        }
      });
    }
    this.viewService.filteredDisplayData = temporaryData;
  }

  filterDateColumns(columnDateFilter: ColumnDateFilter) {
    const column = columnDateFilter.column;

    return this.viewService.displayData.filter((data) => {
      if (columnDateFilter != null && data[column] != null) {
        const dataDate = new Date(data[column]);
        const startDate = new Date(columnDateFilter.startDate);
        const endDate = new Date(columnDateFilter.endDate);

        return dataDate >= startDate && dataDate <= endDate;
      }
      return false;
    });
  }

  private objectValuesContains(data: any) {
    return Object.values(data).some((property) =>
      String(property).toUpperCase().includes(String(this.getFilterData().searchFilter).toUpperCase())
    );
  }

  sortColumn(dataName: string, sortedColumn: SortedColumn, column: string) {
    if (sortedColumn.columnName == column) {
      sortedColumn.ascending = !sortedColumn.ascending;
    } else {
      sortedColumn = { columnName: column, ascending: false };
    }

    if (sortedColumn.ascending) {
      this.viewService.filteredDisplayData = this.viewService.sortAscending(
        dataName,
        this.viewService.filteredDisplayData
      );
    } else {
      this.viewService.filteredDisplayData = this.viewService.sortDescending(
        dataName,
        this.viewService.filteredDisplayData
      );
    }
  }
}
