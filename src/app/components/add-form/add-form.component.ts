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

  selectData: {key: string, data: string[] }[] = []; 

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
    let index = 0;
    for (const key in this.formData){
      if (this.formData.hasOwnProperty(key)) {
        const field = this.formData[key];

        if (field.inputType == 'select' && field.dataType.startsWith('enum')) {
          const options = this.deriveEnumOptions(field);
          this.selectData.push({key: key, data: options});
        }
        const validators = field.required ? [Validators.required] : [];
        this.addForm.addControl(field.fields, this.fb.control({ value: '', disabled: false }, validators));
        index++;
      }
    }
    this.addForm.addControl('action', this.fb.control('add'));
    this.addForm.addControl('table_name', this.fb.control(this.tableName));
  }

  hide() {
    this.formService.hideAddForm();
  }

  formSubmit() {
    this.dataService.submitFormData(this.addForm.value).subscribe((data: any) => {
      this.formService.setMessageFormData({title: data.success ? 'Success!' : 'Error!', message: data.message});
      this.formService.showMessageForm();
      this.hide();
      this.formService.requestReload();
    })
  }

  deriveEnumOptions(field: any) {
    return field.dataType
    .replace('enum(', '')
    .replace(')', '')
    .split(',')
    .map((option: any) => option.replace(/'/g, '').trim());
  }

  selectDataFromKey(key: string) {
    const matchingData = this.selectData.find(data => data.key === key);
  
    if (matchingData) {
      console.log(matchingData.data);
      return matchingData.data;
    }
  
    return [];
  }
}
