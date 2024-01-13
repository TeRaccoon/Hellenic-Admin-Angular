import { Component } from '@angular/core';
import { DataService } from '../../services/data.service';
import { FormService } from '../../services/form.service';

@Component({
  selector: 'app-delete-form',
  templateUrl: './delete-form.component.html',
  styleUrls: ['./delete-form.component.scss']
})
export class DeleteFormComponent {
  formVisible = 'hidden';
  ids: string[] = [];
  tableName: string = "";

  constructor(private dataService: DataService, private formService: FormService) {  }

  ngOnInit() {
    this.formService.getDeleteFormVisibility().subscribe((visible) => {
      this.formVisible = visible ? 'visible' : 'hidden';
      this.ids = this.formService.getDeleteFormIds();
      this.tableName = this.formService.getSelectedTable();
    });
  }

  hide() {
    this.formService.hideDeleteForm();
  }

  deleteRow() {
    var idString = "";
    if (this.ids.length > 1) {
      this.ids.forEach(id => {
        idString += id + ", ";
      });
      idString = idString.substring(0, idString.length - 2);
    }
    else {
      idString = this.ids[0];
    }
    this.dataService.submitFormData({action: 'delete', id: idString, table_name: this.tableName}).subscribe((data: any) => {

    });
  }
}
