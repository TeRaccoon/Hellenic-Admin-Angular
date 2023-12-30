import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DataService } from '../../services/data.service';
import { FormService } from '../../services/form.service';
import { faSpinner, faPencil, faSearch } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-view',
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.scss'],
})
export class ViewComponent {
  faSpinner = faSpinner;
  faPencil = faPencil;
  faSearch = faSearch;
  
  selectedOption: string | null = null;
  data: { [key: string]: any }[] = [];
  displayNames: { [key: string]: any }[] = [];
  displayData: any[] = [];
  filteredDisplayData: any[] = [];
  edittable = {
    columns: [],
    types: [],
    names: [],
    required: [],
    fields: [],
  };

  entryLimit: number = 10;
  searchText: string = '';
  filter: string = '';
  setFilter = false;

  constructor(private formService: FormService, private route: ActivatedRoute, private dataService: DataService) {}

  ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      this.selectedOption = params['table'] || null;
      this.loadTable(String(this.selectedOption));
    });
  }

  async loadTable(table: string) {
    this.dataService.collectData("table", table).subscribe((data: any) => {
      if (Array.isArray(data.data)) {
        this.data = data.data;
      } else {
        this.data = [data.data];
      }
      this.displayData = data.display_data;
      this.filteredDisplayData = data.display_data;
      this.displayNames = data.display_names;
      this.edittable = data.edittable;
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
  }

  itemContainsFilter(item: any) {
    return Object.values(item).some(value => String(value).includes(this.filter))
  }

  toggleFilter() {
    this.filter = this.searchText;
    
  }
}
