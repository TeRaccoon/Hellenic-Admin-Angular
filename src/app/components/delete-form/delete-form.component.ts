import { Component } from '@angular/core';
import { DataService } from '../../services/data.service';
import { FormService } from '../../services/form.service';
import { lastValueFrom } from 'rxjs';

@Component({
  selector: 'app-delete-form',
  templateUrl: './delete-form.component.html',
  styleUrls: ['./delete-form.component.scss']
})
export class DeleteFormComponent {
  formVisible = 'hidden';
  ids: number[] = [];
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

  async deleteRow() {
    var idString = "";
    if (this.ids.length > 1) {
      this.ids.forEach(id => {
        idString += id + ", ";
      });
      idString = idString.substring(0, idString.length - 2);
    }
    else {
      idString = String(this.ids[0]);
    }
    
    let deletionResponse = await lastValueFrom(this.dataService.submitFormData({action: 'delete', id: idString, table_name: this.tableName}));
    this.formService.setMessageFormData({title: deletionResponse.success ? 'Success!' : 'Error!', message: deletionResponse.message});
    this.formService.showMessageForm();
    this.hide();
    this.formService.requestReload();
  }
}
