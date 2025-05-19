import { Component, EventEmitter, Input, Output } from '@angular/core';
import { TABLE_ICONS } from '../../../../common/icons/table-icons';
import { SubmissionData, TableName, TableNameEnum, TableTypeMap } from '../../../../common/types/tables';
import { DataService } from '../../../../services/data.service';
import { FormService } from '../../../form/service';
import { ViewService } from '../../service';

@Component({
  selector: 'app-table-data',
  templateUrl: './table-data.component.html',
  styleUrl: './table-data.component.scss',
})
export class TableDataComponent<T extends keyof TableTypeMap> {
  constructor(
    private dataService: DataService,
    private formService: FormService,
    private service: ViewService
  ) {}

  @Input() column!: keyof TableTypeMap[T];
  @Input() data!: TableTypeMap[TableName][];
  @Input() tableName!: TableName;
  @Input() item!: any;
  @Input() dataTypes!: any[];
  @Input() imageUrlBase!: string;
  @Input() columnIndex!: number;

  @Output() reloadEvent = new EventEmitter<boolean>();

  icon = TABLE_ICONS.lock;

  async changeCheckBox<T extends TableName>(event: Event, key: number, columnName: keyof TableTypeMap[T]) {
    const dataArray = this.data as TableTypeMap[T][];

    const originalItem = dataArray.find((item) => item.id === key);
    if (!originalItem) {
      throw new Error(`Item with id ${key} not found`);
    }

    const data = { ...this.data.find((d) => d.id === key) } as TableTypeMap[T] & {
      action?: string;
      table_name?: string;
    };

    (data[columnName] as string) = (event.target as HTMLInputElement).checked ? 'Yes' : 'No';

    data.action = 'append';
    data.table_name = String(this.tableName);

    await this.dataService.submitFormData(data);
    this.reloadEvent.emit(true);
  }

  getCurrencyCode<T extends TableName>(column: keyof TableTypeMap[T]) {
    return this.service.getCurrencyCode(column, this.tableName as T);
  }

  shouldColourCell(data: string) {
    return this.service.shouldColourCell(data, this.tableName);
  }

  displayWithIcon(row: any) {
    switch (this.tableName) {
      case 'invoices':
        if (this.column == 'id') {
          this.icon = row['status'] == 'Complete' ? TABLE_ICONS.lock : TABLE_ICONS.lockOpen;
          return true;
        }
        break;
    }
    return false;
  }

  async iconClick<T extends TableNameEnum>(row: TableTypeMap[T]) {
    switch (this.tableName) {
      case 'invoices': {
        const invoicesData = this.data as TableTypeMap[TableNameEnum.Invoices][];
        const invoicesRow = row as TableTypeMap[TableNameEnum.Invoices];

        const item = invoicesData.find((d) => d.id === row.id);

        if (!item) return;

        const data: SubmissionData<TableTypeMap['invoices']> = {
          ...item,
          action: 'append',
          table_name: 'invoices',
        };

        if (this.column === 'id') {
          data.status = data.status === 'Complete' ? 'Pending' : 'Complete';
          invoicesRow.status = data.status;
        }

        const submissionResponse = await this.dataService.submitFormData(data);
        if (submissionResponse.success) {
          this.reloadEvent.emit(false);
        } else {
          this.formService.setMessageFormData({
            title: 'Error!',
            message: 'There was an error trying to unlock the booking!',
          });
        }
        break;
      }
    }
  }
}
