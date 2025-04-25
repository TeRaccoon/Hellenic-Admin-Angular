export interface ColumnFilterOptions {
  displayColumn: string[];
  column: ColumnFilter[];
  columnDate: ColumnDateFilter[];
}

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
