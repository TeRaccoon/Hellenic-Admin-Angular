import { Component, effect } from '@angular/core';
import { faX } from '@fortawesome/free-solid-svg-icons';
import { DataService } from '../../services/data.service';
import { FormService } from '../form/service';
import { FormType } from '../form/types';

@Component({
  selector: 'app-delete-form',
  templateUrl: './delete-form.component.html',
  styleUrls: ['./delete-form.component.scss'],
})
export class DeleteFormComponent {
  visible = false;
  ids: number[] = [];
  tableName = '';

  formText: string;

  faX = faX;

  confirm = false;

  constructor(
    private dataService: DataService,
    private formService: FormService
  ) {
    this.formText = 'Are you sure you want to delete this row?';

    effect(() => {
      const visible = this.formService.getFormVisibilitySignal(FormType.Delete)();
      this.visible = visible;
      this.load();
    });
  }

  load() {
    this.formText = 'Are you sure you want to delete this row?';

    this.ids = this.formService.getDeleteFormIds();
    this.tableName = this.formService.getSelectedTable();

    if (this.ids.length > 1) {
      this.formText = 'Are you sure you want to delete these rows?';
    }
  }

  hide() {
    this.confirm = false;
    this.formService.setFormVisibility(FormType.Delete, false);
  }

  async deleteRow() {
    const idString = this.setIdString();

    const deletionResponse = await this.dataService.submitFormData({
      action: 'delete',
      id: idString,
      table_name: this.tableName,
    });

    if (deletionResponse.error == 'FOREIGN_KEY') {
      if (this.ids.length == 1) {
        this.confirm = true;
      }
      this.formText = `There was an error! ${deletionResponse.message} THIS IS A VERY DANGEROUS ACTION. All related entries in other tables will be removed. Are you sure you want to proceed?`;
    } else {
      this.formService.setMessageFormData({
        title: deletionResponse.success ? 'Success!' : 'Error!',
        message: deletionResponse.message,
      });

      this.hide();
      this.formService.requestReload('hard');
    }
  }

  async deleteRowHard() {
    const idString = this.setIdString();

    const referencedColumns = await this.dataService.processPost({
      action: 'column-usage',
      table_name: this.tableName,
      id: idString,
    });

    for (const column of referencedColumns) {
      await this.dataService.submitFormData({
        action: 'delete',
        id: column.id,
        table_name: column.table,
      });
    }

    const deletionResponse = await this.dataService.submitFormData({
      action: 'delete',
      id: idString,
      table_name: this.tableName,
    });

    this.formService.setMessageFormData({
      title: deletionResponse.success ? 'Success!' : 'Error!',
      message: deletionResponse.message,
    });

    this.hide();
    this.formService.requestReload('hard');
  }

  setIdString() {
    if (this.ids.length > 1) {
      return this.ids.join(', ');
    } else {
      return String(this.ids[0]);
    }
  }
}
