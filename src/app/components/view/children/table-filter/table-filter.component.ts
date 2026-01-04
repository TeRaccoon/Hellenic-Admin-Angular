import { Component, EventEmitter, Input, Output } from '@angular/core';
import { TableName, TableTypeMap } from '../../../../common/types/tables';
import { FilterService } from '../../../../services/filter.service';
import { FormService } from '../../../form/service';
import { FormType } from '../../../form/types';
import { ReloadEvent } from '../../types';
import { TABLE_FILTER_ICONS } from './icons';

@Component({
  selector: 'app-table-filter',
  templateUrl: './table-filter.component.html',
  styleUrl: './table-filter.component.scss',
})
export class TableFilterComponent {
  @Input() columns!: TableTypeMap[TableName];
  @Input() dataTypes!: string[];
  @Input() displayNames!: string[];

  @Output() reloadTable = new EventEmitter<ReloadEvent>();
  @Output() clearFilterEmitter = new EventEmitter<{ filter: string; reload: boolean }>();

  icons = TABLE_FILTER_ICONS;

  searchFilter = '';

  get displayColumnFilters() {
    return this.filterService.DisplayColumnFilters;
  }
  get columnFilters() {
    return this.filterService.ColumnFilters;
  }
  get columnDateFilters() {
    return this.filterService.ColumnDateFilters;
  }

  constructor(
    private filterService: FilterService,
    private formService: FormService
  ) {}

  removeColumnFilter(columnFilterIndex: number) {
    this.filterService.removeColumnFilter(columnFilterIndex);

    this.reloadTable.emit({
      loadTable: true,
      isToggle: false,
    });
  }

  removeColumnDateFilter(columnFilterIndex: number) {
    this.filterService.removeColumnDateFilterByIndex(columnFilterIndex);
    this.reloadTable.emit({
      loadTable: true,
      isToggle: false,
    });
  }

  showAdvancedFilter() {
    this.filterService.setTableColumns(this.displayNames, this.columns, this.dataTypes);
    this.formService.setFormVisibility(FormType.Filter, true);
  }

  getFilterData() {
    return this.filterService.getFilterData();
  }

  clearFilter(filter: string, reload: true) {
    this.clearFilterEmitter.emit({ filter: filter, reload: reload });
  }

  setTableFilter() {
    this.filterService.setFilterData({
      searchFilter: this.searchFilter,
      searchFilterApplied: true,
    });
    this.reloadTable.emit({
      loadTable: false,
      isToggle: false,
    });
  }
}
