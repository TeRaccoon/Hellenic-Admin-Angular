import { Component } from '@angular/core';
import { DataService } from '../../services/data.service';
import { FormService } from '../../services/form.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-edit-form',
  templateUrl: './edit-form.component.html',
  styleUrls: ['./edit-form.component.scss']
})
export class EditFormComponent {
  editForm: FormGroup;
  formData: { [key: string]: { value: any, inputType: string, dataType: string, required: boolean, fields: string } } = {};
  tableName: string = "";
  id: string = "";
  formVisible = 'hidden';

  constructor(private dataService: DataService, private formService: FormService, private fb: FormBuilder) {
    this.editForm = this.fb.group({
    });
  }

  ngOnInit() {
    this.formService.getEditFormVisibility().subscribe((visible) => {
      this.formVisible = visible ? 'visible' : 'hidden';
      if (visible) {
        this.loadForm();
      }
    });
  }

  loadForm() {
    if (this.formService.getSelectedId() != "") {
      this.editForm.reset();
      this.formData = this.formService.getEditFormData();
      this.tableName = this.formService.getSelectedTable();
      this.id = this.formService.getSelectedId();
      this.buildForm();
    }
  }

  buildForm() {
    for (const key in this.formData) {
      if (this.formData.hasOwnProperty(key)) {
        const field = this.formData[key];
        const validators = field.required ? [Validators.required] : [];
  
        if (this.editForm.contains(field.fields)) {
          this.editForm.get(field.fields)?.setValue(field.value);
        } else {
          this.editForm.addControl(
            field.fields,
            this.fb.control({ value: field.value, disabled: false }, validators)
          );
        }
      }
    }
    this.editForm.addControl('action', this.fb.control('append'));
    this.editForm.addControl('id', this.fb.control(this.id));
    this.editForm.addControl('table_name', this.fb.control(this.tableName));
  }

  formSubmit() {
    this.dataService.submitFormData(this.editForm.value).subscribe((data: any) => {
      this.formService.setMessageFormData({title: data.success ? 'Success!' : 'Error!', message: data.message});
      this.formService.showMessageForm();
      this.hide();
      this.formService.requestReload();
    });
  }

  hide() {
    this.formService.hideEditForm();
  } 
}