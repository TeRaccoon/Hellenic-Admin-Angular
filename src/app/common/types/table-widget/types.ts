import { ColumnTypes } from './const';

export interface TableData {
  headers: string[];
  query: string;
  displayDateRange: boolean;
  columnTypes: ColumnTypes[];
  alternativeData: any;
}

export interface VatData {
  output_total: number;
  output_vat: number;
  input_total: number;
  input_vat: number;
  liability: number;
}
