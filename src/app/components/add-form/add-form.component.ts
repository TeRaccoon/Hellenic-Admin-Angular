import { Component } from '@angular/core';
import { DataService } from '../../services/data.service';
import { FormService } from '../../services/form.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { faCloudUpload, faSpinner, faX, faAsterisk, faPlus } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-add-form',
  templateUrl: './add-form.component.html',
  styleUrls: ['./add-form.component.scss'],
})
export class AddFormComponent {
  faCloudUpload = faCloudUpload;
  faSpinner = faSpinner;
  faX = faX;
  faAsterisk = faAsterisk;
  faPlus = faPlus;

  addForm: FormGroup;
  mappedFormDataKeys: any;
  mappedFormData: Map<string, {value: any;
    inputType: string;
    dataType: string;
    required: boolean;
    fields: string;}> = new Map(); 
    
  formData: {
    [key: string]: {
      inputType: string;
      dataType: string;
      required: boolean;
      fields: string;
      value: string
    };
  } = {};
  formVisible = 'hidden';
  tableName: string = '';

  file: File | null = null;
  fileName = '';

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
  loaded = false;
  submitted = false;

  autoGeneratedReplacement: { [key: string]: {value: string} } = {};

  alternativeSelectedData: { [key: string]: {selectData: string} } = {};
  selectedReplacementData: { [key:string]: {selectData: string, selectDataId: Number | null } | null} = {};
  selectedReplacementFilter: { [key:string]: {selectFilter: string } } = {};
  selectOpen: {[key: string]: {opened: boolean}} = {};

  constructor(
    private dataService: DataService,
    private formService: FormService,
    private fb: FormBuilder,
  ) {
    this.addForm = this.fb.group({});
  }

  ngOnInit() {
    this.formService.getAddFormVisibility().subscribe(async (visible) => {
      this.clearForm();
      this.formVisible = visible ? 'visible' : 'hidden';
      if (visible) {
        this.loadForm();
      }
    });
  }

  async loadForm() {
    this.clearForm();
    this.formData = this.formService.getAddFormData();
    this.tableName = this.formService.getSelectedTable();
    if (this.tableName !== '' && Object.keys(this.formData).length != 0) {
      this.buildForm();
      await this.replaceAmbiguousData();
      await this.isAutoGenerated();
      this.loaded = true;
    }
  }
  
  clearForm() {
    this.loaded = false;
    this.formData = {};
    this.replacementData = {};
    this.addForm = this.fb.group({});
    this.addForm.reset();
    this.submitted = false;
  }

  async replaceAmbiguousData() {
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
      this.alternativeSelectedData[key] = { selectData: '' };
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
  }

  async isAutoGenerated() {
    switch (this.tableName) {
      case "invoices":
        await this.replaceAutoGeneratedFields("title");
        break;
    }
    return false;
  }

  async replaceAutoGeneratedFields(field: string) {
    switch (field) {
      case "title":
        this.dataService.collectData("next-invoice-id", this.tableName).subscribe((data: any) => {
          this.autoGeneratedReplacement[field] = {value: "INV" + data.next_id};
        });
        break;
    }
  }

  buildForm() {
    let formDataArray = Object.entries(this.formData);
    formDataArray.sort((a: any, b: any) => a[1].inputType.localeCompare(b[1].inputType));
    this.mappedFormData = new Map(formDataArray);
    this.mappedFormDataKeys = Array.from(this.mappedFormData.keys());

    for (const key in this.formData) {
      if (this.formData.hasOwnProperty(key)) {
        const field = this.formData[key];
        
        var characterLimit = null;
        if (field.dataType.includes('varchar')) {
          let match = field.dataType.match(/\d+/g);
          characterLimit = match ? parseInt(match[0]) : null;
        }

        if (field.inputType == 'select' && field.dataType.startsWith('enum')) {
          const options = this.deriveEnumOptions(field);
          this.selectData.push({ key: key, data: options });
        }

        let controlValidators = characterLimit != null ? [Validators.maxLength(characterLimit)] : [];
        if (field.required) {
          controlValidators.push(Validators.required);
        }
        
        this.addForm.addControl(
          field.fields,
          this.fb.control({ value: field.value != null ? field.value : '', disabled: false }, controlValidators),
        );
      }
    }
    this.addForm.addControl('action', this.fb.control('add'));
    this.addForm.addControl('table_name', this.fb.control(this.tableName));
  }

  formSubmit(hideForm: boolean) {
    this.submitted = true;
    if (this.addForm.valid) {
      if (this.file != null && this.addForm.value['retail_item_id']) {
        this.dataService
          .collectData(
            'image-count-from-item-id',
            this.addForm.value['retail_item_id']
          )
          .subscribe((data: any) => {
            if (this.file) {
              if (data != null) {
                this.fileName = data + 1 + '_' + this.file.name;
              } else {
                this.fileName = this.file.name;
              }
              this.addForm.value['image_file_name'] = this.fileName;
  
              const formData = new FormData();
  
              formData.append('image', this.file, this.fileName);
              this.sumbissionWithImage(formData, hideForm);
            }
          });
      } else {
        this.sumbissionWithoutImage(hideForm);
      }
    }
  }

  submitImageOnly() {
    if (this.file != null && this.tableName == 'retail_items') {
      if (!this.addForm.value['item_id']) {
        this.error = "You must select an Item ID before uploading an image!";
      }
      else {
        this.dataService.collectData('image-count-from-item-id', this.addForm.value['item_id']).subscribe((data: any) => {
          if (this.file) {
            if (data != null && this.selectedReplacementData['Item ID']?.selectData) {
              this.fileName = this.selectedReplacementData['Item ID'].selectData.replaceAll(' ', '_') + '_' + 1 + '.png';
            } else {
              this.fileName = this.file.name;
            }
  
            const formData = new FormData();
  
            formData.append('image', this.file, this.fileName);
            this.dataService.uploadImage(formData).subscribe((uploadResponse: any) => {
              if (uploadResponse.success) {
                const formData = new FormData();
                formData.append('action', 'add');
                formData.append('table_name', 'retail_items');
                formData.append('item_id', this.addForm.value['item_id']);
                formData.append('image_file_name', this.fileName);
                this.dataService.submitFormData(formData).subscribe((insertResponse: any) => {
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
      }
    } else {
      this.error = "Please choose an image to upload before trying to upload!";
    }
  }

  sumbissionWithoutImage(hideForm: boolean) {
    this.dataService.submitFormData(this.addForm.value).subscribe((data: any) => {
        this.formService.setMessageFormData({
          title: data.success ? 'Success!' : 'Error!',
          message: data.message,
        });
        this.endSumbission(data.success, hideForm);
    });
  }

  sumbissionWithImage(formData: FormData, hideForm: boolean) {
    this.dataService.uploadImage(formData).subscribe((uploadResponse: any) => {
      if (uploadResponse.success) {
        this.dataService
          .submitFormData(this.addForm.value)
          .subscribe((data: any) => {
            this.formService.setMessageFormData({
              title: data.success ? 'Success!' : 'Error!',
              message: data.message,
            });
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

  endSumbission(reset: boolean, hideForm: boolean) {
    this.formService.showMessageForm();
    hideForm && this.hide();
    if (reset) {
      this.formService.requestReload();
    }
  }

  primeImage(event: any, submit: boolean) {
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

  hide() {
    this.formService.hideAddForm();
  }

  updateSelectedReplacementDataFromKey(dataId: Number, dataValue: string, key: string, field: string) {
    this.selectedReplacementData[key] = {selectData: dataValue, selectDataId: dataId};
    this.addForm.get(field)?.setValue(dataId);
    this.selectOpen[key].opened = false;
  }

  filterDropSelect(key: string, event: any, field: string | null) {
    this.filteredReplacementData = JSON.parse(JSON.stringify(this.replacementData));
    var filter = event.target.value;
    this.filteredReplacementData[key].data = this.replacementData[key].data.filter((data) => {
      return data.replacement.includes(filter);
    });
    if (field) {
      this.addForm.get(field)?.setValue(filter);
    }
  }

  updateAlternativeSelectData(field: string, data: any, key: string) {
    this.alternativeSelectedData[key] = { selectData: data };
    this.addForm.get(field)?.setValue(data);
    this.selectOpen[key].opened = false;
  }

  addInvoicedItem(event: Event) {
    event.preventDefault();
    this.findInvalidControls();
    if (this.addForm.valid) {
      this.formSubmit(false);
      this.tableName = 'invoiced_items';
      this.formService.setSelectedTable('invoiced_items');
      this.dataService.collectData('edit-form-data', 'invoiced_items').subscribe((data: any) => {
        this.formService.processAddFormData(data);
        this.loadForm();
      });
    } else {
      this.error = "Please fill in all the required fields before continuing!"
    }
  }

  findInvalidControls() {
    const invalid = [];
    const controls = this.addForm.controls;
    for (const name in controls) {
        if (controls[name].invalid) {
            invalid.push(name);
        }
    }
    return invalid;
  }

  inputHasError(field: string) {
    return this.addForm.get(field)?.invalid && this.submitted;
  }
  
  openSelect(key: any) {
    for (let keys in this.selectOpen) {
      this.selectOpen[keys].opened = false
    }
    this.selectOpen[key] = { opened: true };
  }
}
