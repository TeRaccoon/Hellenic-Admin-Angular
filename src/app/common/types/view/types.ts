import { TableTypeMap } from '../tables';

export interface columnFilter {
  column: string;
  filter: string;
  caseSensitive: boolean;
}

export interface columnDateFilter {
  column: string;
  startDate: Date;
  endDate: Date;
}

export interface SortedColumn<T extends keyof TableTypeMap> {
  columnName: keyof TableTypeMap[T];
  ascending: boolean;
}

export interface viewMetadata {
  loaded: boolean;
  entryLimit: number;
  pageCount: number;
  currentPage: number;
}

export interface FilterData {
  searchFilter: string;
  searchFilterApplied: boolean;
}
