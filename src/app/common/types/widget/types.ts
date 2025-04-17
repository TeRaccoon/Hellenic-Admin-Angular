export interface TableColumns {
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
    delivery: number;
    totalNet: number;
}

export interface WidgetData {
    headers: TableColumns[];
    rows: any[];
    tableName: string;
    title: string;
    idData: TableIdData;
    query: string;
    disabled: TableDisabled;
    extra: TableExtra | undefined;
}

export enum ColumnTypes {
    Number = 'number',
    String = 'string',
    Image = 'image',
    Percent = 'percent',
    Currency = 'currency',
    Date = 'date'
}


