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
  tableColumns: { columnNames: { [key: string]: any }[], columns: string[] } = {
    columnNames: [],
    columns: [],
  };

  searchInput: string = '';
  columnInput: string = '';

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
    this.filterService.setColumnFilter({column: this.columnInput, filter: this.searchInput })
    this.formService.requestReload();
    this.hide();
  }
}
