import { Config } from './type';

export const CONFIG: Config = {
  ranges: [
    {
      label: '0-30 Days',
      data: [0, 30],
    },
    {
      label: '31-60 Days',
      data: [31, 60],
    },
    {
      label: '61-90 Days',
      data: [61, 90],
    },
    {
      label: '90+ Days',
      data: [90, null],
    },
  ],
  labels: [
    {
      header: 'Debtors',
      type: 'debtor',
    },
    {
      header: 'Creditors',
      type: 'creditor',
    },
  ],
};

export const COLUMN_TYPES = ['string', 'string', 'currency', 'date'];

export const DEBTOR_HEADERS = ['Reference', 'Account Name', 'Total Debt', 'Last Transaction'];

export const CREDITOR_HEADERS = ['Reference', 'Account Name', 'Total Credit', 'Last Transaction'];
