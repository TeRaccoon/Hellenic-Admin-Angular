import { TableTypeMap } from '../tables';

export interface ColumnFilter {
  column: string;
  filter: string;
  caseSensitive: boolean;
}

export interface ColumnDateFilter {
  column: string;
  startDate: Date;
  endDate: Date;
}

export interface SortedColumn<T extends keyof TableTypeMap> {
  columnName: keyof TableTypeMap[T];
  ascending: boolean;
}

export interface ViewMetadata {
  loaded: boolean;
  entryLimit: number;
  pageCount: number;
  currentPage: number;
}

export interface FilterData {
  searchFilter: string;
  searchFilterApplied: boolean;
}

export enum ExtraColumns {
  EditRow = 'edit-row',
  DeleteRow = 'delete-row',
}

export enum ReloadType {
  Hard = 'hard',
  Filter = 'filter',
}
