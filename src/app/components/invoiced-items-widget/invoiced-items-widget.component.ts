import { Component } from '@angular/core';
import { DataService } from '../../services/data.service';
import { FormService } from '../../services/form.service';
import { faX } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-invoiced-items-widget',
  templateUrl: './invoiced-items-widget.component.html',
  styleUrls: ['./invoiced-items-widget.component.scss']
})
export class InvoicedItemsWidgetComponent {
  data: { [key: string]: { name: string, quantity: number}[]} = {};
  formData: any | null = null;
  faX = faX;

  formVisible = 'hidden';

  constructor(private dataService: DataService, private formService: FormService) {}

  ngOnInit() {
    this.formService.getInvoicedItemsFormVisibility().subscribe(async (visible) => {
      this.formVisible = visible ? 'visible' : 'hidden';
      if (visible) {
        this.data = {};
        this.dataService.retrieveWidgetData().subscribe((data: any) => {
          this.data = data;
        });
      }
    })
  }

  addInvoicedItem() {
    this.getAddFormData();
  }

  getAddFormData() {
    this.dataService.collectData("table", "invoiced_items").subscribe((data: any) => {
      this.formData = data.edittable;
      var addFormData: { [key:string]: { inputType: string, dataType: string, required: boolean, fields: string, value: any } } = {};
      var inputDataTypes: string[] = this.dataTypeToInputType(this.formData.types);
      this.formData.columns.forEach((_: any, index: number) => {
        addFormData[this.formData.names[index]] = {
          inputType: inputDataTypes[index],
          dataType: this.formData.types[index],
          required: this.formData.required[index],
          fields: this.formData.fields[index],
          value: null
        };
      });
      this.formService.setAddFormData(addFormData);
      this.formService.setSelectedTable("invoiced_items");
      this.formService.showAddForm();
      this.formService.setReloadType("soft");
    });
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

  hide() {
    this.formService.hideInvoicedItemForm();
  }
}
