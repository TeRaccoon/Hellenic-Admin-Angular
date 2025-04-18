import { Component } from '@angular/core';
import { FormService } from '../form/service';
import { FilterService } from '../../services/filter.service';
import { faSearch, faPlus, faX } from '@fortawesome/free-solid-svg-icons';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-filter-form',
  templateUrl: './filter-form.component.html',
  styleUrls: ['./filter-form.component.scss'],
})
export class FilterFormComponent {
  private readonly subscriptions = new Subscription();

  faSearch = faSearch;
  faPlus = faPlus;
  faX = faX;

  formVisible = 'hidden';
  tableColumns: {
    columnNames: { [key: string]: any }[];
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

  searchInput: string = '';
  columnInput: string = '';
  columnType: string = '';
  columnIndex = 0;
  caseSensitive: boolean = false;
  startDate: Date | null = null;
  endDate: Date | null = null;

  errorMsg: string | null = null;

  constructor(
    private formService: FormService,
    private filterService: FilterService
  ) { }

  ngOnInit() {
    this.subscriptions.add(
      this.formService.getFilterFormVisibility().subscribe(async (visible) => {
        this.formVisible = visible ? 'visible' : 'hidden';
        this.tableColumns = this.filterService.getTableColumns();
        this.errorMsg = null;
      })
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  hide() {
    this.formService.hideFilterForm();
  }

  search(hide: boolean) {
    if (
      this.columnInput != '' &&
      ((this.columnType == 'date' &&
        this.startDate != null &&
        this.endDate != null) ||
        (this.columnType != 'date' && this.searchInput != ''))
    ) {
      if (
        this.columnType == 'date' &&
        this.startDate != null &&
        this.endDate != null
      ) {
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
      hide && this.hide();
      this.resetForm();
    } else {
      this.errorMsg = 'Please fill in all required fields';
    }
  }

  getColumnType() {
    var index = this.tableColumns.columns.indexOf(this.columnInput);
    this.columnType = this.tableColumns.dataTypes[index];
    this.columnIndex = index;
    if (this.tableColumns.dataTypes[index].includes('enum')) {
      this.columnType = 'enum';
      this.deriveEnumOptions();
    }
  }

  deriveEnumOptions() {
    var index = this.tableColumns.columns.indexOf(this.columnInput);
    this.options = this.formService.deriveEnumOptions(
      this.tableColumns.dataTypes[index]
    );
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
    this.errorMsg = null;
  }
}
