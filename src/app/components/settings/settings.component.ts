import { Component } from '@angular/core';
import { DataService } from '../../services/data.service';
import { lastValueFrom } from 'rxjs';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FormService } from '../../services/form.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent {
  settings: any = [];
  faSpinner = faSpinner;

  loaded = false;

  settingsForm: FormGroup;

  changes: { [key: string]: {id: string, value: any, type: any}}[] = [];

  constructor(private dataService: DataService, private fb: FormBuilder, private formService: FormService) {
    this.settingsForm = this.fb.group({});
  }

  ngOnInit() {
    this.build();
  }

  async build() {
    await this.collectSettings();
    this.buildForm();
    this.loaded = true;
  }

  async collectSettings() {
    let settingsRaw = await lastValueFrom(this.dataService.collectData('table', 'settings'));

    const edittableSettings = settingsRaw.edittable;

    edittableSettings.columns.forEach((column: any, index: number) => {
      this.settings[column] = { name: edittableSettings.names[index], data: settingsRaw.data[column], required: edittableSettings.required[index], type: edittableSettings.types[index], key: column};
    });
    this.settings = this.settings;
  }

  buildForm() {
    this.getColumnHeaders(this.settings).forEach((key: string) => {
      const field = this.settings[key];

      const validators = field['required'] ? [Validators.required] : [];
      let initialValue = field['data'] !== null ? field['data'] : '';

      if (field.type == "enum('Yes','No')") {
        initialValue = initialValue == 'Yes' ? true : false;
      }

      this.settingsForm.addControl(
        key,
        this.fb.control(initialValue, validators)
      );
    });

    this.settingsForm.addControl('id', this.fb.control('1'));
    this.settingsForm.addControl('action', this.fb.control('append'));
    this.settingsForm.addControl('table_name', this.fb.control('settings'));
  }

  getColumnHeaders(obj: { [key: string]: any }): string[] {
    return obj ? Object.keys(obj) : [];
  }

  async formSubmit() {
    const formData = { ...this.settingsForm.value };
    Object.keys(formData).forEach(key => {
      if (formData[key] === true) {
        formData[key] = 'Yes';
      }
      if (formData[key] === false) {
        formData[key] = 'No';
      }
    });

    const formSubmitResponse = await lastValueFrom(this.dataService.submitFormData(formData));
    this.endSubmission(formSubmitResponse);
  }

  endSubmission(formSubmitResponse: {success: boolean, message: string}) {
    let title = "Error!";
    let message = "There was an issue saving the settings! Make sure everything is correct before trying to save.";
    
    if (formSubmitResponse.success) {
      title = "Success!";
      message = "Settings saved successfully!";
    }

    this.formService.setMessageFormData({title, message});
    this.formService.showMessageForm();
  }
}
