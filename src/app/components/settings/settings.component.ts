import { Component } from '@angular/core';
import { DataService } from '../../services/data.service';
import { Subscription } from 'rxjs';
import {
  faSpinner,
  faAsterisk,
  faCloudUpload,
} from '@fortawesome/free-solid-svg-icons';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FormService } from '../../services/form.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
})
export class SettingsComponent {
  private readonly subscriptions = new Subscription();

  settings: any = [];
  bands: any = [];
  faSpinner = faSpinner;
  faAsterisk = faAsterisk;
  faCloudUpload = faCloudUpload;

  loaded = false;

  settingsForm: FormGroup;

  changes: any = {};
  originalValues: any = {};

  constructor(
    private dataService: DataService,
    private fb: FormBuilder,
    private formService: FormService
  ) {
    this.settingsForm = this.fb.group({});
  }

  ngOnInit() {
    this.build();
  }

  async build() {
    await this.collectSettings();
    this.buildForm();
    this.changes = this.settingsForm.value;
    this.originalValues = this.settingsForm.value;
    this.loaded = true;
    this.trackFormChanges();
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  async collectSettings() {
    let settingsRaw = await this.dataService.processGet('table', {
      filter: 'settings',
    });

    const editableSettings = settingsRaw.editable;

    editableSettings.columns.forEach((column: any, index: number) => {
      this.settings[column] = {
        name: editableSettings.names[index],
        data: settingsRaw.data[column],
        required: editableSettings.required[index],
        type: editableSettings.types[index],
        key: column,
      };
    });

    let data = await this.dataService.processGet('table', { filter: 'bands' });
    this.bands = data['display_data'];
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
    Object.keys(formData).forEach((key) => {
      if (typeof formData[key] === 'boolean') {
        formData[key] = formData[key] === true ? 'Yes' : 'No';
      }
    });

    const formSubmitResponse = await this.dataService.submitFormData(formData);
    this.endSubmission(formSubmitResponse);
  }

  endSubmission(formSubmitResponse: { success: boolean; message: string }) {
    let title = 'Error!';
    let message =
      'There was an issue saving the settings! Make sure everything is correct before trying to save.';

    if (formSubmitResponse.success) {
      title = 'Success!';
      message = 'Settings saved successfully!';

      this.changes = {};
      this.originalValues = {};
    }

    this.formService.setMessageFormData({ title, message });
    this.formService.showMessageForm();
  }

  trackFormChanges() {
    this.subscriptions.add(
      this.settingsForm.valueChanges.subscribe((data) => {
        this.changes = data;
      })
    );
  }

  async saveBand(index: number, minWeight: any, maxWeight: any, price: any) {
    let formData = {
      id: index + 1,
      name: this.bands[index]['name'],
      min_weight: minWeight,
      max_weight: maxWeight,
      price: price,
      action: 'append',
      table_name: 'bands',
    };

    let response = await this.dataService.submitFormData(formData);
    this.formService.setMessageFormData({
      title: response.success ? 'Success!' : 'Error!',
      message: response.message,
    });
    this.formService.showMessageForm();
  }

  async uploadDocument(event: any, documentType: string) {
    const file = event.target.files[0];
    const formData = new FormData();
    formData.append('document', file, documentType + '.html');

    let response = await this.dataService.uploadDocument(formData);
    this.formService.setMessageFormData({
      title: response.success ? 'Success!' : 'Error!',
      message: response.message,
    });
    this.formService.showMessageForm();
  }
}
