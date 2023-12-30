import { Component } from '@angular/core';
import { DataService } from '../../services/data.service';
import { FormService } from '../../services/form.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-add-form',
  templateUrl: './add-form.component.html',
  styleUrls: ['./add-form.component.scss']
})
export class AddFormComponent {
  addForm: FormGroup;
  formVisible = 'hidden';
  formData: { [key:string]: { inputType: string, dataType: string, required: boolean, fields: string } } = {};
  tableName: string = "";

  constructor(private dataService: DataService, private formService: FormService, private fb: FormBuilder) {
    this.addForm = this.fb.group({
    });
  }

  ngOnInit() {
    this.formService.getAddFormVisibility().subscribe((visible) => {
      this.formVisible = visible ? 'visible' : 'hidden';
      this.formData = this.formService.getAddFormData();
      this.tableName = this.formService.getSelectedTable();
      if (this.tableName != "") {
        this.buildForm();
      }
    });
  }

  buildForm() {
    for (const key in this.formData){
      if (this.formData.hasOwnProperty(key)) {
        const field = this.formData[key];
        const validators = field.required ? [Validators.required] : [];
        this.addForm.addControl(field.fields, this.fb.control({ value: '', disabled: false }, validators));
      }
    }
    this.addForm.addControl('action', this.fb.control('add'));
    this.addForm.addControl('table_name', this.fb.control(this.tableName));
  }

  hide() {
    this.formService.hideAddForm();
  }

  formSubmit() {
    console.log(this.addForm.value);
    this.dataService.submitFormData(this.addForm.value).subscribe((data: any) => {
      console.log(data);
    })
  }
}
