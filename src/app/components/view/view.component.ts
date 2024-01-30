import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DataService } from '../../services/data.service';
import { FormService } from '../../services/form.service';
import { FilterService } from '../../services/filter.service';
import { faSpinner, faPencil, faSearch, faPrint, faTrashCan, faFilter, faX } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-view',
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.scss'],
})
export class ViewComponent {
  faSpinner = faSpinner;
  faPencil = faPencil;
  faSearch = faSearch;
  faPrint = faPrint;
  faTrashCan = faTrashCan;
  faFilter = faFilter;
  faX = faX;
  
  selectedOption: string | null = null;
  displayName: string = "";
  tableFilter: string | null = null;
  queryFilter: string | null = null;
  columnFilter: string | null = null;

  data: { [key: string]: any }[] = [];
  displayNames: { [key: string]: any }[] = [];
  displayData: any[] = [];
  dataTypes: any[] = [];
  filteredDisplayData: any[] = [];
  edittable = {
    columns: [],
    types: [],
    names: [],
    required: [],
    fields: [],
  };

  selectedRows: number[] = [];

  entryLimit: number = 10;
  pageCount: number = 0;
  currentPage: number = 1;

  loaded = false;

  searchText: string = '';
  filter: string = '';
  setFilter = false;

  constructor(private router: Router, private filterService: FilterService, private formService: FormService, private route: ActivatedRoute, private dataService: DataService) {}

  ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      this.selectedOption = params['table'] || null;
      if (this.selectedOption != null) {
        this.displayName = this.selectedOption.replace("_", " ");
        this.formService.setSelectedTable(String(this.selectedOption));
        this.loadTable(String(this.selectedOption));
        this.pageCount = 0;
        this.currentPage = 1;
        this.loadPage();
      }
    });

    this.formService.getReloadRequest().subscribe((reloadRequested: boolean) => {
      if (reloadRequested) {
        this.loadTable(String(this.selectedOption));
        this.loadPage();
        this.formService.performReload();
      }
    });
  }

  async loadTable(table: string) {
    this.loaded = false;
    this.queryFilter = this.filterService.getTableFilter();
    var queryString = this.queryFilter == null ? "table" : this.queryFilter;

    if (this.filterService.getTableFilter() == null) {
      queryString = "table"
    }

    this.dataService.collectData(queryString, table).subscribe((data: any) => {
      this.data = Array.isArray(data.data) ? data.data : [data.data];
      this.displayData = Array.isArray(data.display_data) ? data.display_data : [data.display_data];

      this.dataTypes = data.types;
      this.filteredDisplayData = this.displayData;
      this.displayNames = data.display_names;
      this.edittable = data.edittable;

      var columnFilter = this.filterService.getColumnFilter();
      if (columnFilter != null) {
        this.filterColumns(columnFilter);
      }

      this.pageCount = Math.floor(this.filteredDisplayData.length / this.entryLimit) + 1;

      this.loaded = true;
    });
  }

  filterColumns(columnFilter: any) {
    var isCaseSensitive = this.filterService.getCaseSensitive();

    var column = columnFilter.column;
    this.columnFilter = isCaseSensitive ? columnFilter.filter : String(columnFilter.filter).toLowerCase();

    this.displayData = this.displayData.filter((data) => {
      if (this.columnFilter != null && data[column] != null && String(isCaseSensitive ? data[column] : data[column].toLowerCase()).includes(this.columnFilter)) {
        return data;
      }
    });
    this.filteredDisplayData = this.displayData;
  }

  dataTypeToInputType(dataTypes: any[]) {
    var inputTypes: any[] = [];
    dataTypes.forEach((dataType: string) => {
      switch(dataType) {
        case "date":
          inputTypes.push("date");
          break;
        
        case "file":
          inputTypes.push("file");
          break;

        default:
          if (!dataType.includes("enum")) {
            inputTypes.push("text");
          } else {
            inputTypes.push("select");
          }
      }
    });
    return inputTypes;
  }

  getColumnHeaders(obj: { [key: string]: any }): string[] {
    return obj ? Object.keys(obj) : [];
  }

  async editRow(id: any) {
    var editFormData = this.getEditFormData(id);
    console.log(editFormData);
    this.formService.setEditFormData(editFormData);
    this.formService.setSelectedTable(String(this.selectedOption));
    this.formService.setSelectedId(id);
    this.formService.showEditForm();
  }

  async addRow() {
    var addFormData = this.getAddFormData();
    this.formService.setAddFormData(addFormData);
    this.formService.setSelectedTable(String(this.selectedOption));
    this.formService.showAddForm();
  }

  deleteRow(id: string) {
    this.formService.setSelectedTable(String(this.selectedOption));
    this.formService.setDeleteFormIds([id]);
    this.formService.showDeleteForm();
  }

  getEditFormData(id: number) {
    var editFormData: { [key: string]: { value: any, inputType: string, dataType: string , required: boolean, fields: string } } = {};
    var row = this.data.filter((row: any) => row.id == id)[0];
    var inputDataTypes: string[] = this.dataTypeToInputType(this.edittable.types);
    this.edittable.columns.forEach((columnName, index) => {
      editFormData[this.edittable.names[index]] = {
        value: row[columnName],
        inputType: inputDataTypes[index],
        dataType: this.edittable.types[index],
        required: this.edittable.required[index],
        fields: this.edittable.fields[index],
      };
    });
    return editFormData;
  }

  getAddFormData() {
    var addFormData: { [key:string]: { inputType: string, dataType: string, required: boolean, fields: string } } = {};
    var inputDataTypes: string[] = this.dataTypeToInputType(this.edittable.types);
    this.edittable.columns.forEach((_, index) => {
      addFormData[this.edittable.names[index]] = {
        inputType: inputDataTypes[index],
        dataType: this.edittable.types[index],
        required: this.edittable.required[index],
        fields: this.edittable.fields[index],
      };
    });
    return addFormData;
  }

  changeEntries(event: Event) {
    const option = event.target as HTMLInputElement;
    this.entryLimit = Number(option.value);
    this.pageCount = Math.ceil(this.displayData.length / this.entryLimit);
    this.currentPage = 1;
    this.loadPage();
  }

  itemContainsFilter(item: any) {
    return this.filter != null && item != null && Object.values(item).some(value => String(value).includes(this.filter))
  }

  setTableFilter() {
    this.tableFilter = this.searchText;
    this.loadPage();
  }

  applyTemporaryFilter() {
    var temporaryData: any[] = [];
    this.displayData.forEach(data => {
      if (Object.values(data).some(property => String(property).toUpperCase().includes(String(this.tableFilter).toUpperCase()))) {
        temporaryData.push(data);
      }
    });
    return temporaryData;
  }

  nextPage() {
    if (this.currentPage < this.pageCount) {
      this.currentPage++;
      this.loadPage();
    }
  }
  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.loadPage();
    }
  }
  changePage(page: number) {
    this.currentPage = page;
    this.loadPage();
  }

  loadPage() {
    var start = (this.currentPage - 1) * this.entryLimit;
    var end = start + this.entryLimit;
    if (this.tableFilter == null) {
      this.filteredDisplayData = this.displayData.slice(start, end);
    } else {
      this.filteredDisplayData = this.applyTemporaryFilter();
      this.pageCount = Math.floor(this.filteredDisplayData.length / this.entryLimit) + 1;
      this.filteredDisplayData = this.filteredDisplayData.slice(start, end);
    }
  }

  getPageRange(): number[] {
    const range = [];
    var start = this.currentPage;
    
    if (this.currentPage > this.pageCount -2 && this.pageCount -2 > 0) {
      start = this.pageCount - 2;
    }
    if (start == 1 && this.pageCount > 1) {
      start += 2;
    }
    else if (start == 2 && this.pageCount > 1) {
      start += 1;
    }
    for (let i = start - 1; i < start + 2 && i < this.pageCount && this.pageCount > 1; i++) {
      range.push(i);
    }

    if (this.pageCount > 1) {
      range.push(this.pageCount);
    }

    return range;
  }

  isColumnBool(key: number) {
    if (this.dataTypes[key].includes("enum")) {
      if (String(this.dataTypes[key]) == "enum('Yes','No')") {
        return true;
      }
    }
    return false;
  }

  isColumnImage(key: number) {
    return this.dataTypes[key] == "file";
  }

  changeCheckBox(event: Event, key: number, columnName: string) {
    const option = event.target as HTMLInputElement;
    let checked = option.checked;
    let data = { ...this.data[key] };
    data[columnName] = checked ? "Yes" : "No";
    data['action'] = 'append';
    data['table_name'] = String(this.selectedOption);
    this.dataService.submitFormData(data).subscribe((data: any) => {
    });
  }

  selectRow(event: Event, rowId: number) {
    const option = event.target as HTMLInputElement;
    let checked = option.checked;
    if (checked) {
      this.selectedRows.push(rowId);
    } else {
      this.selectedRows = this.selectedRows.filter(function (item) { return item !== rowId; })
    }
  }

  print() {
    if (this.selectedRows.length > 0) {
      this.dataService.storePrintInvoiceIds(this.selectedRows);
      this.router.navigate(['/print/invoice']);
    } else {
      this.formService.setMessageFormData({title: "Error", message: "Please select an invoice before trying to print!"});
      this.formService.showMessageForm();
    }
  }

  clearTableFilter() {
    this.tableFilter = null;
    this.loadTable(String(this.selectedOption));
    this.changePage(1);
  }

  clearQueryFilter() {
    this.filterService.clearFilter();
    this.queryFilter = null;
    this.loadTable(String(this.selectedOption)); 
    this.changePage(1);
  }

  clearColumnFilter() {
    this.filterService.clearColumnFilter();
    this.columnFilter = null;
    this.loadTable(String(this.selectedOption));    
    this.changePage(1);
  }

  shouldColourCell(data: any) {
    switch(this.selectedOption) {
      case "invoices":
        switch(data) {
          case "Overdue":
            return "red";
          case "Complete":
            return "green";
          case "Pending":
            return "orange";
        }
        break;        
    }
    return null;
  }

  showAdvancedFilter() {
    var columns = Object.keys(this.displayData[0]);
    this.filterService.setTableColumns(this.displayNames, columns);
    this.formService.showFilterForm();
  }
}
