import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DataService } from '../../services/data.service';
import { FormService } from '../../services/form.service';
import { faSpinner, faPencil, faSearch, faPrint, faTrashCan } from '@fortawesome/free-solid-svg-icons';

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
  
  selectedOption: string | null = null;
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

  searchText: string = '';
  filter: string = '';
  setFilter = false;

  constructor(private router: Router, private formService: FormService, private route: ActivatedRoute, private dataService: DataService) {}

  ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      this.selectedOption = params['table'] || null;
      this.loadTable(String(this.selectedOption));
      this.pageCount = Math.ceil(this.displayData.length / 10);
      this.currentPage = 1;
      this.loadPage();
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
    this.dataService.collectData("table", table).subscribe((data: any) => {
      if (Array.isArray(data.data)) {
        this.data = data.data;
      } else {
        this.data = [data.data];
      }
      this.displayData = Array.isArray(data.display_data) ? data.display_data : [data.display_data];
      this.dataTypes = data.types;
      this.filteredDisplayData = this.displayData;
      this.displayNames = data.display_names;
      this.edittable = data.edittable;

      this.pageCount = Math.floor(this.displayData.length / this.entryLimit);
    });
  }

  dataTypeToInputType(dataTypes: any[]) {
    var inputTypes: any[] = [];
    dataTypes.forEach((dataType: string) => {
      switch(dataType) {
        case "date":
          inputTypes.push("date");
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

  async editRow(id: number) {
    var editFormData = this.getEditFormData(id);
    this.formService.setEditFormData(editFormData);
    this.formService.setSelectedTable(String(this.selectedOption));
    this.formService.setSelectedId(this.data[id]['id']);
    this.formService.showEditForm();
  }

  async addRow() {
    var addFormData = this.getAddFormData();
    this.formService.setAddFormData(addFormData);
    this.formService.setSelectedTable(String(this.selectedOption));
    this.formService.showAddForm();
  }

  getEditFormData(id: number) {
    var editFormData: { [key: string]: { value: any, inputType: string, dataType: string , required: boolean, fields: string } } = {};
    var row = this.data[id];
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
    return Object.values(item).some(value => String(value).includes(this.filter))
  }

  toggleFilter() {
    var filter = this.searchText;
    if (filter != '') {
      this.filteredDisplayData = [];
    } else {
      this.filteredDisplayData = this.displayData;
    }
    this.displayData.forEach(data => {
      if (Object.values(data).some(property => String(property).toUpperCase().includes(filter.toUpperCase()))) {
        this.filteredDisplayData.push(data);
      }
    });
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
    this.filteredDisplayData = this.displayData.slice(start, end);
  }

  getPageRange(): number[] {
    var start = this.currentPage;
    if (this.currentPage > this.pageCount -2 && this.pageCount -2 > 0) {
      start = this.pageCount - 2;
    }
    if ((start == 1 || start == 2) && this.pageCount > 1) {
      start += 2;
    }
    const range = [];
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

  deleteRow(rowId: number) {
    this.formService.setSelectedTable(String(this.selectedOption));
    this.formService.setDeleteFormIds([this.data[rowId]['id']]);
    this.formService.showDeleteForm();
  }

  print() {
    this.dataService.storePrintInvoiceIds(this.selectedRows);
    this.router.navigate(['/print/invoice']);
  }
}
