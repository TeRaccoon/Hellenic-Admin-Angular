import { Component, effect } from '@angular/core';
import { FilterService } from '../../services/filter.service';
import { FormService } from '../form/service';
import { ICONS } from './icons';

@Component({
  selector: 'app-filter-form',
  templateUrl: './filter-form.component.html',
  styleUrls: ['./filter-form.component.scss'],
})
export class FilterFormComponent {
  icons = ICONS;

  formVisible = 'hidden';
  tableColumns: {
    columnNames: Record<string, any>[];
    columns: string[];
    dataTypes: string[];
  } = {
    columnNames: [],
    columns: [],
    dataTypes: [],
  };

  options: string[] = [];
  selectedOption = '';
  open = -1;

  searchInput = '';
  columnInput = '';
  columnType = '';
  columnIndex = 0;
  caseSensitive = false;
  startDate: Date | null = null;
  endDate: Date | null = null;

  error: string | null = null;

  constructor(
    private formService: FormService,
    private filterService: FilterService
  ) {
    effect(() => {
      const visible = this.formService.getFilterFormVisibility()();
      this.formVisible = visible ? 'visible' : 'hidden';
      this.tableColumns = this.filterService.getTableColumns();
      this.error = null;
    });
  }

  hide() {
    this.formService.hideFilterForm();
  }

  search(hide: boolean) {
    if (
      this.columnInput != '' &&
      ((this.columnType == 'date' && this.startDate != null && this.endDate != null) ||
        (this.columnType != 'date' && this.searchInput != ''))
    ) {
      if (this.columnType == 'date' && this.startDate != null && this.endDate != null) {
        this.filterService.setColumnDateFilter({
          column: this.columnInput,
          startDate: this.startDate,
          endDate: this.endDate,
        });
      } else {
        this.filterService.setColumnFilter({
          column: this.columnInput,
          filter: this.searchInput,
          caseSensitive: this.caseSensitive,
        });
      }
      this.formService.setReloadType('filter');
      this.formService.requestReload();

      if (hide) {
        this.hide();
      }

      this.resetForm();
    } else {
      this.error = 'Please fill in all required fields';
    }
  }

  getColumnType() {
    const index = this.tableColumns.columns.indexOf(this.columnInput);
    this.columnType = this.tableColumns.dataTypes[index];
    this.columnIndex = index;
    if (this.tableColumns.dataTypes[index].includes('enum')) {
      this.columnType = 'enum';
      this.deriveEnumOptions();
    }
  }

  deriveEnumOptions() {
    const index = this.tableColumns.columns.indexOf(this.columnInput);
    this.options = this.formService.deriveEnumOptions(this.tableColumns.dataTypes[index]);
  }

  openDropdown() {
    this.open = this.columnIndex;
  }

  closeDropdown() {
    this.open = -1;
  }

  selectOption(option: string) {
    this.searchInput = option;
  }

  resetForm() {
    this.searchInput = '';
    this.columnInput = '';
    this.columnType = '';
    this.startDate = null;
    this.endDate = null;
    this.error = null;
  }

  hasError(value: any) {
    return (value != null || value != '') && this.error != null;
  }
}
