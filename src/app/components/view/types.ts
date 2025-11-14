export interface ItemImage {
  item_id: number;
  file_name: string;
}

export interface StockTotals {
  item_id: string;
  total_quantity: string;
}

export interface ReloadEvent {
  loadTable: boolean;
  isToggle: boolean;
}

export interface ColumnDateFilter {
  column: string;
  startDate: Date;
  endDate: Date;
}

export interface SortedColumn {
  columnName: string;
  ascending: boolean;
}
