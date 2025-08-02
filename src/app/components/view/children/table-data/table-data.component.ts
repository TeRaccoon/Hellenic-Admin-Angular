import { Component, effect, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { PLACEHOLDER_IMAGE_FILE_NAME } from '../../../../common/consts/const';
import { TABLE_ICONS } from '../../../../common/icons/table-icons';
import { FormSubmission } from '../../../../common/types/data-service/types';
import { ColumnKey, SubmissionData, TableName, TableNameEnum, TableTypeMap } from '../../../../common/types/tables';
import { DataService } from '../../../../services/data.service';
import { FormService } from '../../../form/service';
import { ViewService } from '../../service';
import { ReloadEvent } from '../../types';
import { TableDataService } from './services';

type InvoiceRow = TableTypeMap[TableNameEnum.Invoices];
@Component({
  selector: 'app-table-data',
  templateUrl: './table-data.component.html',
  styleUrl: './table-data.component.scss',
})
export class TableDataComponent<T extends TableName> implements OnInit {
  @Input() column!: keyof TableTypeMap[T];
  @Input() data!: TableTypeMap[TableName][];
  @Input() tableName!: TableName;
  @Input() item!: TableTypeMap[T];
  @Input() dataTypes!: any[];
  @Input() imageUrlBase!: string;
  @Input() columnIndex!: number;

  @Output() reloadEvent = new EventEmitter<ReloadEvent>();

  icon = TABLE_ICONS.lock;
  loading = false;

  placeholderImage!: string;

  constructor(
    private dataService: DataService,
    private formService: FormService,
    private service: TableDataService,
    private viewService: ViewService
  ) {
    effect(() => {
      // this.loading = this.loading && this.service.getToggleLoading();
    });
  }

  ngOnInit() {
    this.placeholderImage = this.imageUrlBase + PLACEHOLDER_IMAGE_FILE_NAME;
  }

  async changeCheckBox(event: Event, key: number, columnName: ColumnKey<T>) {
    this.loading = true;
    this.viewService.setToggleLoading(true);

    await new Promise((resolve) => setTimeout(resolve, 500)); // Gives time for the animation to finish

    const data = this.getCheckboxData(event, key, columnName);

    await this.dataService.submitFormData(data as FormSubmission);
    this.reloadEvent.emit({
      loadTable: true,
      isToggle: true,
    });
  }

  getCheckboxData(event: Event, key: number, columnName: ColumnKey<T>) {
    const data = { ...this.data.find((d) => d.id === key) } as TableTypeMap[T] & {
      action?: string;
      table_name?: string;
    };

    (data[columnName] as string) = (event.target as HTMLInputElement).checked ? 'Yes' : 'No';

    data.action = 'append';
    data.table_name = String(this.tableName);

    return data;
  }

  displayWithIcon(row: TableTypeMap[T]) {
    switch (this.tableName) {
      case 'invoices':
        if (this.column == 'id') {
          this.icon =
            (row as TableTypeMap[TableNameEnum.Invoices])['status'] == 'Complete'
              ? TABLE_ICONS.lock
              : TABLE_ICONS.lockOpen;
          return true;
        }
        break;
    }
    return false;
  }

  async iconClick<T extends TableNameEnum>(row: TableTypeMap[T]) {
    switch (this.tableName) {
      case 'invoices': {
        this.iconClickInvoices(row as TableTypeMap[TableNameEnum.Invoices]);
        break;
      }
    }
  }

  async iconClickInvoices(row: InvoiceRow) {
    const invoicesData = this.data as InvoiceRow[];
    const item = invoicesData.find((d) => d.id === row.id);

    if (!item) return;

    const data: SubmissionData<InvoiceRow> = {
      ...item,
      action: 'append',
      table_name: 'invoices',
    };

    if (this.column === 'id') {
      data.status = data.status === 'Complete' ? 'Pending' : 'Complete';
      row.status = data.status;
    }

    const submissionResponse = await this.dataService.submitFormData(data as FormSubmission);
    if (submissionResponse.success) {
      this.reloadEvent.emit({
        loadTable: true,
        isToggle: false,
      });
    } else {
      this.formService.setMessageFormData({
        title: 'Error!',
        message: 'There was an error trying to unlock the booking!',
      });
    }
  }

  getValue(dataType: string, item: TableTypeMap[T], column: ColumnKey<T>) {
    return this.service.getValue(dataType, item[column] as string, column, this.tableName as T);
  }

  getImageSource(data: TableTypeMap[T][ColumnKey<T>] | null) {
    if (data === null) return this.imageUrlBase + PLACEHOLDER_IMAGE_FILE_NAME;

    return this.imageUrlBase + data;
  }

  getCellClasses(item: TableTypeMap[T], column: ColumnKey<T>) {
    const classes: string[] = [];

    const colourClass = this.viewService.shouldColourCell(item[column] as string, this.tableName);
    if (colourClass) {
      classes.push(colourClass);
    }

    if (this.displayWithIcon(item)) {
      classes.push('icon-data-container');
    }

    return classes;
  }
}
