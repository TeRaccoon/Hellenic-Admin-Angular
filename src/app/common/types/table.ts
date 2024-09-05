export interface SearchResult {
  tableName: string;
  id: number;
  matchedValue: string;
  displayValue: string;
}

export interface Extras {
  StockData: any;
  Images: { [key: string]: any }[];
}

export const EXCLUDED_COLUMNS: Record<string, string[]> = {
  customers: ['currency_code', 'password'],
  suppliers: ['currency_code'],
};
