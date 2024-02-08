import { Component } from '@angular/core';
import { DataService } from '../../services/data.service';
import { FormService } from '../../services/form.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { faCloudUpload } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-add-form',
  templateUrl: './add-form.component.html',
  styleUrls: ['./add-form.component.scss'],
})
export class AddFormComponent {
  faCloudUpload = faCloudUpload;

  addForm: FormGroup;
  formVisible = 'hidden';
  formData: {
    [key: string]: {
      inputType: string;
      dataType: string;
      required: boolean;
      fields: string;
    };
  } = {};
  tableName: string = '';

  file: File | null = null;
  fileName = '';

  selectData: { key: string; data: string[] }[] = [];

  replacementData: { key: string; data: { id: Number; replacement: String }[] }[] = [];

  constructor(
    private dataService: DataService,
    private formService: FormService,
    private fb: FormBuilder,
    private http: HttpClient
  ) {
    this.addForm = this.fb.group({});
  }

  ngOnInit() {
    this.formService.getAddFormVisibility().subscribe(async (visible) => {
      this.formVisible = visible ? 'visible' : 'hidden';
      this.formData = this.formService.getAddFormData();
      this.tableName = this.formService.getSelectedTable();
      if (this.tableName !== '' && Object.keys(this.formData).length != 0) {
        this.buildForm();
        await this.replaceAmbiguousData();
      }
    });
  }

  async replaceAmbiguousData() {
    const data = await this.formService.replaceAmbiguousData(
      this.tableName,
      this.formData,
      this.replacementData,
      this.dataService
    );
    this.formData = data.formData;
    this.replacementData = data.replacementData;
  }

  buildForm() {
    let index = 0;
    for (const key in this.formData) {
      if (this.formData.hasOwnProperty(key)) {
        const field = this.formData[key];

        if (field.inputType == 'select' && field.dataType.startsWith('enum')) {
          const options = this.deriveEnumOptions(field);
          this.selectData.push({ key: key, data: options });
        }
        const validators = field.required ? [Validators.required] : [];
        this.addForm.addControl(
          field.fields,
          this.fb.control({ value: '', disabled: false }, validators)
        );
        index++;
      }
    }
    this.addForm.addControl('action', this.fb.control('add'));
    this.addForm.addControl('table_name', this.fb.control(this.tableName));
  }

  formSubmit() {
    if (this.file != null && this.addForm.value['retail_item_id']) {
      this.dataService.collectData("image-count-from-item-id", this.addForm.value['retail_item_id']).subscribe((data: any) => {
        if (this.file) {
          if (data != null) {
            this.fileName = (data + 1) + "_" + this.file.name;
          } else {
            this.fileName = this.file.name;
          }
          this.addForm.value['image_file_name'] = this.fileName;

          const formData = new FormData();
  
          formData.append('image', this.file, this.fileName);

          this.dataService.uploadImage(formData).subscribe((uploadResponse: any) => {
            if (uploadResponse.success) {
              this.dataService
              .submitFormData(this.addForm.value)
              .subscribe((data: any) => {
                this.formService.setMessageFormData({
                  title: data.success ? 'Success!' : 'Error!',
                  message: data.message,
                });
                this.formService.setReloadType("hard");
                this.formService.requestReload();
              });
            } else {
              this.formService.setMessageFormData({title: 'Error!', message: uploadResponse.message})
            }
            this.formService.showMessageForm();
            this.hide();
          });


        }
      });
    }
  }

  primeImage(event: any) {
    this.file = event.target.files[0];
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
    this.formService.hideAddForm();
  }
}
