import { ColumnTypes } from './const';

export interface TableData {
  headers: string[];
  query: string;
  displayDateRange: boolean;
  columnTypes: ColumnTypes[];
  alternativeData: any;
}
