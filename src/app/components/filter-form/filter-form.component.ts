import { Component, effect, ViewChild } from '@angular/core';
import { FilterService } from '../../services/filter.service';
import { FormService } from '../form/service';
import { FormType } from '../form/types';
import { GenericSearcherComponent } from '../generic-searcher/generic-searcher.component';
import { ICONS } from './icons';
import { TableColumns } from './types';

@Component({
  selector: 'app-filter-form',
  templateUrl: './filter-form.component.html',
  styleUrls: ['./filter-form.component.scss'],
})
export class FilterFormComponent {
  @ViewChild('searchComponent') searchComponent!: GenericSearcherComponent;

  icons = ICONS;

  visible = false;
  tableColumns: TableColumns = {
    columnNames: [],
    columns: undefined,
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
      const visible = this.formService.getFormVisibilitySignal(FormType.Filter)();
      this.visible = visible;
      this.tableColumns = this.filterService.getTableColumns();
      this.error = null;
    });
  }

  hide() {
    this.formService.setFormVisibility(FormType.Filter, false);
  }

  isValid() {
    switch (this.columnType) {
      case 'date':
        return this.startDate != null || this.startDate != undefined;

      default:
        return this.searchInput != null && this.searchInput != undefined && this.searchInput != '';
    }
  }

  search(hide: boolean) {
    if (!this.isValid()) {
      this.error = 'Please fill in all required fields';
      return;
    }

    if (this.isDateSearch()) {
      this.filterService.setColumnDateFilter({
        column: this.columnInput,
        startDate: this.startDate!,
        endDate: this.endDate!,
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
  }

  getColumnType() {
    const index = this.tableColumns.columnNames.indexOf(this.columnInput);
    this.columnType = this.tableColumns.dataTypes[index];
    this.columnIndex = index;
    if (this.tableColumns.dataTypes[index].includes('enum')) {
      this.columnType = 'enum';
      this.deriveEnumOptions();
    }
  }

  deriveEnumOptions() {
    const index = this.tableColumns.columnNames.indexOf(this.columnInput);
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

  isDateSearch() {
    return this.columnType == 'date' && this.startDate != null && this.endDate != null;
  }

  setColumnInput(index: number) {
    this.columnInput = this.tableColumns.columnNames[index];
    this.getColumnType();
    this.searchComponent.close();
  }
}
