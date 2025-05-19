import { WidgetData } from './types';

export const DEFAULT_DISABLED_WIDGET_DATA = {
  value: false,
  message: '',
};

export const DEFAULT_WIDGET_DATA: WidgetData = {
  headers: [
    {
      name: '',
      type: '',
    },
  ],
  rows: [],
  tableName: '',
  title: '',
  idData: {
    id: '',
    columnName: '',
  },
  query: '',
  disabled: DEFAULT_DISABLED_WIDGET_DATA,
  extra: {
    totalGross: 0,
    totalVAT: 0,
    totalNet: 0,
  },
};
