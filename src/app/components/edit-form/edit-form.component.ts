import { Component } from '@angular/core';
import { DataService } from '../../services/data.service';
import { FormService } from '../../services/form.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { faCloudUpload } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-edit-form',
  templateUrl: './edit-form.component.html',
  styleUrls: ['./edit-form.component.scss'],
})
export class EditFormComponent {
  faCloudUpload = faCloudUpload;

  editForm: FormGroup;
  formData: {
    [key: string]: {
      value: any;
      inputType: string;
      dataType: string;
      required: boolean;
      fields: string;
    };
  } = {};
  tableName: string = '';
  id: string = '';
  formVisible = 'hidden';

  fileName = '';
  imageReplacements: string[] = [];
  selectedImage: string = "";
  
  selectData: { key: string; data: string[] }[] = [];

  replacementData: { key: string; data: { id: Number, replacement: String }[] }[] = [];

  constructor(
    private dataService: DataService,
    private formService: FormService,
    private fb: FormBuilder
  ) {
    this.editForm = this.fb.group({});
  }

  ngOnInit() {
    this.formService.getEditFormVisibility().subscribe((visible) => {
      this.selectedImage = "";
      this.imageReplacements = [];
      this.formVisible = visible ? 'visible' : 'hidden';
      if (visible) {
        this.clearForm();
        this.loadForm();
      }
    });
  }

  async replaceAmiguousData() {
    if (Object.keys(this.formData).length != 0) {
      const data = await this.formService.replaceAmbiguousData(
        this.tableName,
        this.formData,
        this.replacementData,
        this.dataService
      );
      this.formData = data.formData;
      this.replacementData = data.replacementData;
    }
  }

  buildForm() {
    for (const key in this.formData) {
      if (this.formData.hasOwnProperty(key)) {
        const field = this.formData[key];

        if (field.inputType == 'select' && field.dataType.startsWith('enum')) {
          const options = this.deriveEnumOptions(field);
          this.selectData.push({ key: key, data: options });
        }
        const validators = field.required ? [Validators.required] : [];

        if (this.editForm.contains(field.fields)) {
          this.editForm.get(field.fields)?.setValue(field.value);
        } else {
          this.editForm.addControl(
            field.fields,
            this.fb.control({ value: field.inputType == 'file' ? null : field.value, disabled: false }, validators)
          );
        }
      }
    }
    this.editForm.addControl('action', this.fb.control('append'));
    this.editForm.addControl('id', this.fb.control(this.id));
    this.editForm.addControl('table_name', this.fb.control(this.tableName));
  }

  primeImage(event: any) {
    const file: File = event.target.files[0];
    if (file) {
      this.fileName = file.name;

      const formData = new FormData();

      formData.append('image', file);

      this.dataService.uploadImage(formData);
    }
  }

  clearForm() {
    this.formData = {};
    this.replacementData = [];
    this.editForm = this.fb.group({});
    this.editForm.reset();
  }

  loadForm() {
    if (this.formService.getSelectedId() != '') {
      this.formData = this.formService.getEditFormData();
      this.tableName = this.formService.getSelectedTable();
      this.id = this.formService.getSelectedId();
      this.replaceAmiguousData();
      this.handleImages();
      this.buildForm();
    }
  }

  handleImages() {
    switch(this.tableName) {
      case "retail_items":
        var id = this.formData['Item ID'].value;
        if (id != null) {
          this.dataService.collectData("images-from-item-id", id).subscribe((data: any) => {
            this.imageReplacements = Array.isArray(data) ? data : [data];
            if (this.formData['Image'].value != null) {
              this.imageReplacements.push(this.formData['Image'].value);
            }
          });
        }
        break;
    }
  }

  async getIdReplacementData(query: string): Promise<any>  {
    return new Promise((resolve, reject) => {
      this.dataService.collectData(query).subscribe(
        (data: any) => {
          resolve(data);
        },
      );
    });
  }

  formSubmit() {
    if (this.fileName != "") {
      this.editForm.value['image_file_name'] = this.fileName;
    }
    this.dataService
      .submitFormData(this.editForm.value)
      .subscribe((data: any) => {
        this.formService.setMessageFormData({
          title: data.success ? 'Success!' : 'Error!',
          message: data.message,
        });
        this.formService.showMessageForm();
        this.hide();
        this.formService.requestReload();
      });
  }

  deriveEnumOptions(field: any) {
    return field.dataType
      .replace('enum(', '')
      .replace(')', '')
      .split(',')
      .map((option: any) => option.replace(/'/g, '').trim());
  }

  selectDataFromKey(key: string) {
    const matchingData = this.selectData.find((data) => data.key === key);

    if (matchingData) {
      return matchingData.data;
    }

    return [];
  }

  getReplacementDataFromKey(key: string) {
    const replacementData = this.replacementData.find((data) => data.key === key);
    if (replacementData) {
      return replacementData.data;
    }
    return [];
  }

  hide() {
    this.formService.hideEditForm();
  }
}
