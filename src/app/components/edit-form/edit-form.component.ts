import { Component } from '@angular/core';
import { DataService, imageUrlBase } from '../../services/data.service';
import { FormService } from '../../services/form.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { faCloudUpload, faSpinner, faX, faAsterisk } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-edit-form',
  templateUrl: './edit-form.component.html',
  styleUrls: ['./edit-form.component.scss'],
})
export class EditFormComponent {
  faCloudUpload = faCloudUpload;
  faSpinner = faSpinner;
  faX = faX;
  faAsterisk = faAsterisk;

  imageUrlBase = imageUrlBase;

  editForm: FormGroup;
  mappedFormDataKeys: any;
  mappedFormData: Map<string, {value: any;
    inputType: string;
    dataType: string;
    required: boolean;
    fields: string;}> = new Map(); 

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
  locked = false;
  loaded = false;

  file: File | null = null;
  fileName = '';
  
  imageReplacements: string[] = [];
  selectedImage: string = "";
  
  selectData: { key: string; data: string[] }[] = [];

  filteredReplacementData: any = {};

  replacementData: {
    [key: string]: {
      data: { id: Number; replacement: string }[];
    }
  } = {};

  alternativeSelectData: {
    [key: string]: {
      data: {value: string}[]
    }
  } = {};

  error: string | null = null;
  submitted = false;
  
  alternativeSelectedData: { [key: string]: {selectData: string} } = {};
  selectedReplacementData: { [key:string]: {selectData: string, selectDataId: Number | null } | null} = {};
  selectedReplacementFilter: { [key:string]: {selectFilter: string } } = {};
  selectOpen: {[key: string]: {opened: boolean}} = {};


  constructor(
    private dataService: DataService,
    private formService: FormService,
    private fb: FormBuilder
  ) {
    this.editForm = this.fb.group({});
  }

  ngOnInit() {
    this.formService.getEditFormVisibility().subscribe((visible) => {
      this.clearForm();
      this.formVisible = visible ? 'visible' : 'hidden';
      if (visible) {
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
      this.filteredReplacementData = data.replacementData;
      this.replacementData = data.replacementData;
      this.alternativeSelectData = this.formService.getAlternativeSelectData();
      Object.keys(this.alternativeSelectData).forEach((key) => {
        this.alternativeSelectedData[key] = { selectData: this.formData[key]?.value };
      });
      Object.keys(this.replacementData).forEach((key) => {
        if (!Array.isArray(this.filteredReplacementData[key].data)) {
          this.filteredReplacementData[key].data = [this.filteredReplacementData[key].data];
        }
        var tempReplacement = this.formData[key].value == null ? '' : this.filteredReplacementData[key].data.find((item: { id: number; data: string; }) => item.id === Number(this.formData[key].value))!.replacement;
        this.selectedReplacementData[key] = { selectData: tempReplacement, selectDataId: Number(this.formData[key].value) };
        this.selectedReplacementFilter[key] = { selectFilter: ''};
        this.selectOpen[key] = {opened: false};
      });
      this.loaded = true;
    }
  }

  buildForm() {
    this.isLocked();
    
    let formDataArray = Object.entries(this.formData);
    formDataArray.sort((a: any, b: any) => a[1].inputType.localeCompare(b[1].inputType));
    this.mappedFormData = new Map(formDataArray);
    this.mappedFormDataKeys = Array.from(this.mappedFormData.keys());
    
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
            this.fb.control({ value: field.inputType == 'file' ? null : field.value, disabled: this.locked }, validators)
          );
        }
      }
    }
    this.editForm.addControl('action', this.fb.control('append'));
    this.editForm.addControl('id', this.fb.control(this.id));
    this.editForm.addControl('table_name', this.fb.control(this.tableName));
  }


  primeImage(event: any, submit: boolean) {
    this.file = event.target.files[0];
  }

  clearForm() {
    this.loaded = false;
    this.locked = false;
    this.selectedImage = "";
    this.imageReplacements = [];
    this.formData = {};
    this.replacementData = {};
    this.editForm = this.fb.group({});
    this.editForm.reset();
    this.submitted = false;
    this.error = null;
    this.file = null;
  }

  async loadForm() {
    if (this.formService.getSelectedId() != '') {
      this.formData = this.formService.getEditFormData();
      this.tableName = this.formService.getSelectedTable();
      this.id = this.formService.getSelectedId();
      this.buildForm();
      this.handleImages();
      await this.replaceAmiguousData();
    }
  }

  handleImages() {
    switch(this.tableName) {
      case "retail_items":
      case "items":
        var id = this.tableName == "retail_items" ? this.mappedFormData.get('Item ID')!.value : this.formService.getSelectedId();
        if (id != null) {
          this.dataService.collectData("images-from-item-id", id).subscribe((data: any) => {
            this.imageReplacements = Array.isArray(data) ? data : [data];
            if (this.mappedFormData.get('Image')!.value != null) {
              this.imageReplacements.push(this.mappedFormData.get('Image')!.value);
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

  formSubmit(hideForm: boolean) {
    this.submitted = true;
    if (this.editForm.valid) {
      if (this.file != null) {
        let itemId = this.editForm.value['retail_item_id'] != null ? this.editForm.value['retail_item_id'] : this.editForm.get('id')?.value;
        if (itemId != null) {
          this.dataService
          .collectData(
            'image-count-from-item-id',
            itemId
          )
          .subscribe((data: any) => {
            if (this.file) {
              if (data != null) {
                this.fileName = data + 1 + '_' + this.file.name;
              } else {
                this.fileName = this.file.name;
              }
              this.editForm.value['image_file_name'] = this.fileName;
  
              const formData = new FormData();
  
              formData.append('image', this.file, this.fileName);
              this.submissionWithImage(formData, hideForm);
            }
          });
        }
      } else {
        this.submissionWithoutImage(hideForm);
      }
    }
  }

  submitImageOnly() {
    if (this.file != null && this.tableName == 'items') {
      this.dataService.collectData('image-count-from-item-id', this.editForm.get('id')!.value).subscribe((data: any) => {
        if (this.file) {
          if (data != null) {
            this.fileName = this.editForm.get('item_name')!.value.replaceAll(' ', '_') + '_' + 1 + '.png';
          } else {
            this.fileName = this.file.name;
          }

          const formData = new FormData();

          formData.append('image', this.file, this.fileName);
          this.dataService.uploadImage(formData).subscribe((uploadResponse: any) => {
            if (uploadResponse.success) {

              let imageFormData = {
                'action': 'add',
                'table_name': 'retail_item_images',
                'item_id': this.formService.getSelectedId(),
                'image_file_name': this.fileName
            };

              this.dataService.submitFormData(imageFormData).subscribe((insertResponse: any) => {
                if (insertResponse.success) {
                  this.formService.setMessageFormData({
                    title: 'Success!',
                    message: 'Image uploaded successfully as ' + this.fileName,
                  });
                } else {
                  this.formService.setMessageFormData({
                    title: 'Error!',
                    message: insertResponse.message,
                  });
                }
                this.formService.showMessageForm();
              });
            } else {
              this.formService.setMessageFormData({
                title: 'Error!',
                message: uploadResponse.message,
              });
              this.formService.showMessageForm();
            }
          });
        }
      });
    } else {
      this.error = "Please choose an image to upload before trying to upload!";
    }
  }  
  
  submissionWithoutImage(hideForm: boolean) {
    console.log(this.editForm.value);
    this.dataService.submitFormData(this.editForm.value).subscribe((data: any) => {
        this.formService.setMessageFormData({
          title: data.success ? 'Success!' : 'Error!',
          message: data.message,
        });
        this.endSubmission(data.success, hideForm);
    });
  }

  submissionWithImage(formData: FormData, hideForm: boolean) {
    this.dataService.uploadImage(formData).subscribe((uploadResponse: any) => {
      if (uploadResponse.success) {
        this.dataService
          .submitFormData(this.editForm.value)
          .subscribe((data: any) => {
            this.formService.setMessageFormData({
              title: data.success ? 'Success!' : 'Error!',
              message: data.message,
            });
          this.endSubmission(data.success, hideForm);
          });
      } else {
        this.formService.setMessageFormData({
          title: 'Error!',
          message: uploadResponse.message,
        });
        this.formService.showMessageForm();
        hideForm && this.hide();
      }
    });
  }

  endSubmission(reset: boolean, hideForm: boolean) {
    hideForm && this.formService.showMessageForm();
    hideForm && this.hide();
    if (reset) {
      this.formService.requestReload();
      this.editForm.reset();
      this.alternativeSelectData = {};
      this.selectedReplacementData = {};
      this.submitted = false;
      this.editForm.get('action')?.setValue('add');
      this.editForm.get('table_name')?.setValue(this.tableName);
    }
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

  hide() {
    this.formService.hideEditForm();
  }

  updateSelectedReplacementDataFromKey(dataId: Number, dataValue: string, key: string, field: string) {
    this.selectedReplacementData[key] = {selectData: dataValue, selectDataId: dataId};
    this.editForm.get(field)?.setValue(dataId);
    this.selectOpen[key].opened = false;
  }

  filterDropSelect(key: string, event: any, field: string | null) {
    this.filteredReplacementData = JSON.parse(JSON.stringify(this.replacementData));
    var filter = event.target.value;
    this.filteredReplacementData[key].data = this.replacementData[key].data.filter((data) => {
      return data.replacement.includes(filter);
    });
    if (field) {
      this.editForm.get(field)?.setValue(filter);
    }
  }

  updateAlternativeSelectData(field: string, data: any, key: string) {
    this.alternativeSelectedData[key] = { selectData: data };
    this.editForm.get(field)?.setValue(data);
    this.selectOpen[key].opened = false;
  }

  isLocked() {
    switch (this.tableName) {
      case 'invoices':
        this.locked = this.formData['Status'].value == 'Complete'
    }
  }

  inputHasError(field: string) {
    return this.editForm.get(field)?.invalid && this.submitted;
  }
  
  openSelect(key: any) {
    for (let keys in this.selectOpen) {
      this.selectOpen[keys].opened = false
    }
    this.selectOpen[key] = { opened: true };
  }
}
