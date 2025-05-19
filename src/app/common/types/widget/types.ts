export interface TableHeader {
  name: string;
  type: string;
}

export interface TableIdData {
  id: string;
  columnName: string;
}

export interface TableDisabled {
  value: boolean;
  message: string;
}

export interface TableExtra {
  totalGross: number;
  totalVAT: number;
  totalNet: number;
}

export interface WidgetData {
  headers: TableHeader[];
  rows: any[];
  tableName: string;
  title: string;
  idData: TableIdData;
  query: string;
  disabled: TableDisabled;
  extra: TableExtra | undefined;
}
