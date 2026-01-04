import { Injectable } from '@angular/core';
import { TableName, TableTypeMap } from '../common/types/tables';
import { ColumnFilter, FilterData } from '../common/types/view/types';
import { TableColumns } from '../components/filter-form/types';
import { ViewService } from '../components/view/service';
import { TableDataService } from '../components/view/table-data';
import { ColumnDateFilter, SortedColumn } from '../components/view/types';

@Injectable({
  providedIn: 'root',
})
export class FilterService {
  private _displayColumnFilters: string[] = [];
  private _columnFilters: ColumnFilter[] = [];
  private _columnDateFilters: ColumnDateFilter[] = [];

  get DisplayColumnFilters() {
    return this._displayColumnFilters;
  }
  set DisplayColumnFilters(displayColumnFilters: string[]) {
    this._displayColumnFilters = displayColumnFilters;
  }

  get ColumnFilters() {
    return this._columnFilters;
  }
  set ColumnFilters(columnFilters: ColumnFilter[]) {
    this._columnFilters = columnFilters;
  }

  get ColumnDateFilters() {
    return this._columnDateFilters;
  }
  set ColumnDateFilters(columnDateFilters: ColumnDateFilter[]) {
    this._columnDateFilters = columnDateFilters;
  }

  private tableFilter: string | null = null;

  private tableColumns: TableColumns = {
    columnNames: [],
    columns: null,
    dataTypes: [],
  };

  private filterData: FilterData;
  private protectFilterData = false;

  constructor(
    private viewService: ViewService,
    private tableDataService: TableDataService
  ) {
    this.filterData = {
      searchFilter: '',
      searchFilterApplied: false,
    };
  }

  applyFilter(displayData: any) {
    this._columnFilters = this.getColumnFilter();
    this._columnDateFilters = this.getColumnDateFilter();
    this._displayColumnFilters = [];

    if (this._columnFilters.length + this._columnDateFilters.length == 1) {
      this.viewService.filteredDisplayData = displayData;
    }

    this._columnFilters.forEach((filter: any) => {
      this.filterColumns(filter, displayData);
    });

    this._columnDateFilters.forEach((filter: any) => {
      this.filterDateColumns(filter);
    });
  }

  filterColumns(columnFilter: any, displayData: any) {
    const isCaseSensitive = columnFilter.caseSensitive;
    const column = columnFilter.column as keyof TableTypeMap[TableName];
    const filter = isCaseSensitive ? columnFilter.filter : String(columnFilter.filter).toLowerCase();
    this._displayColumnFilters.push(column + ': ' + columnFilter.filter);

    displayData = displayData.filter((data: any) => {
      if (
        filter != null &&
        data[column] != null &&
        String(isCaseSensitive ? data[column] : String(data[column]).toLowerCase()).includes(filter)
      ) {
        return true;
      }
      return false;
    });

    this.viewService.filteredDisplayData = displayData;
    this.viewService.calculatePageCount(false, this.viewService.ViewMetadata.entryLimit);
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
    if (this._columnFilters && this._columnFilters.length > 0) {
      this._columnFilters.push(columnFilter);
    } else {
      this._columnFilters = [columnFilter];
    }
  }
  getColumnFilter() {
    return this._columnFilters;
  }

  setColumnDateFilter(columnDateFilter: { column: string; startDate: Date; endDate: Date }) {
    if (this._columnDateFilters && this._columnDateFilters.length > 0) {
      this._columnDateFilters.push(columnDateFilter);
    } else {
      this._columnDateFilters = [columnDateFilter];
    }
  }

  getColumnDateFilter() {
    return this._columnDateFilters;
  }

  setTableFilter(filter: string) {
    this.tableFilter = filter;
  }

  getTableFilter() {
    return this.tableFilter;
  }

  clearFilter(filter: string) {
    if (filter === 'all' || filter === 'column-date') {
      this._columnDateFilters = [];
    }

    if (filter === 'all' || filter === 'column') {
      this.clearColumnFilter();
    }

    if (filter === 'all' || filter === 'table') {
      if (filter == 'table') {
        this.protectFilterData = false;
      }
      this.setFilterData({
        searchFilter: '',
        searchFilterApplied: false,
      });
    }
  }

  clearTableFilter() {
    this.tableFilter = null;
  }

  clearColumnFilter() {
    this._columnFilters = [];
    this._displayColumnFilters = [];
  }

  removeColumnFilter(filterIndex: number) {
    const columnFilter = this._columnFilters[filterIndex];

    this._displayColumnFilters = this._displayColumnFilters.filter(
      (filter) => filter != this._displayColumnFilters[filterIndex]
    );
    if (this._columnFilters) {
      this._columnFilters = this._columnFilters.filter((filter: any) => filter.filter != columnFilter);
    }
  }

  removeColumnDateFilter(columnDateFilter: { column: string; startDate: Date; endDate: Date }) {
    if (columnDateFilter) {
      this._columnDateFilters = this._columnDateFilters.filter((filter) => filter != columnDateFilter);
    }
  }

  removeColumnDateFilterByIndex(filterIndex: number) {
    const filterToExclude = this._columnDateFilters[filterIndex];
    this._columnDateFilters = this._columnDateFilters.filter((filter) => filter != filterToExclude);
  }

  clearColumnDateFilter() {
    this._columnDateFilters = [];
  }

  setTableColumns(columnNames: string[], columns: TableTypeMap[TableName], dataTypes: string[]) {
    this.tableColumns = { columnNames, columns, dataTypes };
  }

  getTableColumns(): TableColumns {
    return this.tableColumns;
  }

  applyTemporaryFilter() {
    const temporaryData: TableTypeMap[TableName][] = [];
    if (this.getFilterData().searchFilter != '') {
      this.tableDataService.data.display_data.forEach((data) => {
        if (this.objectValuesContains(data)) {
          temporaryData.push(data);
        }
      });
    }
    this.viewService.filteredDisplayData = temporaryData;
  }

  filterDateColumns(columnDateFilter: ColumnDateFilter) {
    const column = columnDateFilter.column as keyof TableTypeMap[TableName];

    return this.tableDataService.data.display_data.filter((data) => {
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
