import { Component } from '@angular/core';
import { FormService } from '../../services/form.service';
import { FilterService } from '../../services/filter.service';
import { faSearch } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-filter-form',
  templateUrl: './filter-form.component.html',
  styleUrls: ['./filter-form.component.scss']
})
export class FilterFormComponent {
  faSearch = faSearch;

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
  startDate: Date = new Date();
  endDate: Date = new Date();

  constructor(private formService: FormService, private filterService: FilterService) {}

  ngOnInit() {
    this.formService.getFilterFormVisibility().subscribe(async (visible) => {
      this.formVisible = visible ? 'visible' : 'hidden';
      this.tableColumns = this.filterService.getTableColumns();
    });
  }

  hide() {
    this.formService.hideFilterForm();
  }

  search() {
    if (this.columnType == 'date') {
      this.filterService.setColumnDateFilter({column: this.columnInput, startDate: this.startDate, endDate: this.endDate})
    } else {
      this.filterService.setColumnFilter({column: this.columnInput, filter: this.searchInput })
      this.filterService.setCaseSensitive(this.caseSensitive);
    }
    this.formService.setReloadType("hard");
    this.formService.requestReload();
    this.hide();
  }

  getColumnType() {
    console.log(this.tableColumns);
    var index = this.tableColumns.columns.indexOf(this.columnInput);
    this.columnType = this.tableColumns.dataTypes[index];
  }
}
