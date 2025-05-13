import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FilterService } from '../../../../services/filter.service';
import { FormService } from '../../../form/service';
import { FormType } from '../../../form/types';
import { TABLE_FILTER_ICONS } from './icons';
import { ColumnFilterOptions } from './types';

@Component({
  selector: 'app-table-filter',
  templateUrl: './table-filter.component.html',
  styleUrl: './table-filter.component.scss',
})
export class TableFilterComponent {
  @Input() columns!: string[];
  @Input() dataTypes!: string[];
  @Input() filter!: ColumnFilterOptions;
  @Input() displayNames!: Record<string, any>[];

  @Output() reloadTable = new EventEmitter<boolean>();
  @Output() clearFilterEmitter = new EventEmitter<{ filter: string; reload: boolean }>();

  icons = TABLE_FILTER_ICONS;

  searchFilter = '';

  constructor(
    private filterService: FilterService,
    private formService: FormService
  ) {}

  removeColumnFilter(columnFilterIndex: number) {
    this.filter.displayColumn = this.filter.displayColumn.filter(
      (filter) => filter != this.filter.displayColumn[columnFilterIndex]
    );
    this.filterService.removeColumnFilter(this.filter.column[columnFilterIndex].filter);
    this.filter.column = this.filterService.getColumnFilter();

    this.reloadTable.emit(true);
  }

  removeColumnDateFilter(columnFilterIndex: number) {
    this.filterService.removeColumnDateFilter(this.filter.columnDate[columnFilterIndex]);
    this.filter.columnDate = this.filterService.getColumnDateFilter();
    this.reloadTable.emit(true);
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
    this.reloadTable.emit(false);
  }
}
