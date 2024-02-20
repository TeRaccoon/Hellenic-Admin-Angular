import { Component } from '@angular/core';
import { FormService } from '../../services/form.service';
import { FilterService } from '../../services/filter.service';
import { faSearch, faPlus } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-filter-form',
  templateUrl: './filter-form.component.html',
  styleUrls: ['./filter-form.component.scss']
})
export class FilterFormComponent {
  faSearch = faSearch;
  faPlus = faPlus;

  formVisible = 'hidden';
  tableColumns: { columnNames: { [key: string]: any }[], columns: string[], dataTypes: string[] } = {
    columnNames: [],
    columns: [],
    dataTypes: [],
  };

  searchInput: string = '';
  columnInput: string = '';
  columnType: string = '';
  caseSensitive: boolean = false;
  startDate: Date | null = null;
  endDate: Date | null = null;

  errorMsg: string | null = null;

  constructor(private formService: FormService, private filterService: FilterService) {}

  ngOnInit() {
    this.formService.getFilterFormVisibility().subscribe(async (visible) => {
      this.formVisible = visible ? 'visible' : 'hidden';
      this.tableColumns = this.filterService.getTableColumns();
      this.errorMsg = null;
    });
  }

  hide() {
    this.formService.hideFilterForm();
  }

  search(hide: boolean) {
    if (this.columnInput != '' && ((this.columnType == 'date' && this.startDate != null && this.endDate != null) || (this.columnType != 'date' && this.searchInput != ''))) {
      if (this.columnType == 'date' && this.startDate != null && this.endDate != null) {
        this.filterService.setColumnDateFilter({column: this.columnInput, startDate: this.startDate, endDate: this.endDate});
      } else {
        this.filterService.setColumnFilter({column: this.columnInput, filter: this.searchInput, caseSensitive: this.caseSensitive });
      }
      this.formService.setReloadType("filter");
      this.formService.requestReload();
      hide && this.hide();
      this.resetForm();      
    } else {
      this.errorMsg = "Please fill in all required fields";
    }
  }

  getColumnType() {
    console.log(this.tableColumns);
    var index = this.tableColumns.columns.indexOf(this.columnInput);
    this.columnType = this.tableColumns.dataTypes[index];
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
