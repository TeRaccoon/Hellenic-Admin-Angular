import { Injectable } from '@angular/core';
import { TableName } from '../../common/types/tables';
import { DataService } from '../../services/data.service';
import { TableService } from '../../services/table.service';
import { DEFAULT_TABLE_DATA } from './consts';
import { TableData } from './types';

@Injectable({
  providedIn: 'root',
})
export class TableDataService {
  private _data: TableData = DEFAULT_TABLE_DATA;
  private _tableName!: TableName;
  private _displayName!: string;

  constructor(
    private dataService: DataService,
    private tableService: TableService
  ) {}

  async initialize(tableName: TableName) {
    this._tableName = tableName;
    this._displayName = this.tableService.getTableDisplayName(tableName);
    await this.setTableData();
  }

  async setTableData() {
    const tableData: TableData = await this.dataService.processGet('table', {
      filter: this._tableName,
    });

    this._data = tableData;
  }

  get data() {
    return this._data;
  }

  get displayName() {
    return this._displayName;
  }

  set displayName(displayName: string) {
    this._displayName = displayName;
  }

  get tableName() {
    return this._tableName;
  }
}
