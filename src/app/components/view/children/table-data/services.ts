import { CurrencyPipe, DatePipe } from '@angular/common';
import { Injectable } from '@angular/core';
import { TableName, TableNameEnum, TableTypeMap } from '../../../../common/types/tables';

@Injectable({
  providedIn: 'root',
})
export class TableDataService {
  constructor(
    private currencyPipe: CurrencyPipe,
    private datePipe: DatePipe
  ) {}

  getCurrencyCode<T extends TableName>(column: keyof TableTypeMap[T], tableName: T) {
    return (tableName == TableNameEnum.SupplierInvoices &&
      (column == 'net_value' || column == 'VAT' || column == 'total_eur' || column == 'outstanding_balance')) ||
      column == 'amount_eur'
      ? 'EUR'
      : 'GBP';
  }

  getValue<T extends TableName>(dataType: string, data: string, column: keyof TableTypeMap[T], tableName: T) {
    if (data === null) {
      return '---';
    }

    switch (dataType) {
      case 'float':
      case 'decimal(19,2)':
        return this.currencyPipe.transform(data, this.getCurrencyCode(column, tableName));

      case 'double':
        return `${data}%`;

      case 'date':
        return this.datePipe.transform(data, 'dd/MM/yyyy');
    }

    return data;
  }
}
