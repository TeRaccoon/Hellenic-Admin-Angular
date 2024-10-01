import { TableData } from './types';

export enum ColumnTypes {
  Currency = 'currency',
  Date = 'date',
  String = 'string',
}

export const VAT_RETURN: TableData = {
  headers: [
    'Total Sales',
    'Output VAT',
    'Total Expenses',
    'Input VAT',
    'VAT Liability',
  ],
  query: 'vat-data',
  displayDateRange: true,
  columnTypes: [
    ColumnTypes.Currency,
    ColumnTypes.Currency,
    ColumnTypes.Currency,
    ColumnTypes.Currency,
    ColumnTypes.Currency,
  ],
  alternativeData: {
    text: [
      'VAT due in this period on sales and other outputs',
      'VAT due in this period on intra-community acquisitions of goods made in Northern Ireland from EU Member States',
      'Total VAT due (the sum of boxes 1 and 2)',
      'VAT reclaimed in this period on purchases and other inputs (including acquisitions in the EC)',
      'Net VAT to be paid to HMRC or reclaimed by you (Difference between boxes 3 and 4)',
      'Total value of sales and all other outputs excluding any VAT (Include your box 8 figure)',
      'Total value of purchases and all other inputs excluding VAT (Include your box 9 figure)',
      'Total value of intra-community dispatches of goods and related costs (excluding VAT) from Northern Ireland to EU Member States',
      'Total value of intra-community acquisitions of goods and related costs (excluding VAT) made in Northern Ireland from EU Member States',
    ],
    altText: [
      'VAT due and other outputs',
      'VAT due on intra-community acquisitions of goods made in Northern Ireland from EU Member States',
      'Total VAT due',
      'VAT reclaimed on purchases and other inputs including EC acquisitions',
      'Net VAT due',
      'Total value of sales and other outputs including EC supplies',
      'Total value of purchases and other inputs including EC acquisitions',
      'Total value of intra-community dispatches from Northern Ireland to EU Member States',
      'Total value of intra-community acquisitions made in Northern Ireland from EU Member States',
    ],
  },
};
