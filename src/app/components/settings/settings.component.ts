import { Component } from '@angular/core';
import { DataService } from '../../services/data.service';
import {
  faSpinner,
  faAsterisk,
  faCloudUpload,
} from '@fortawesome/free-solid-svg-icons';
import { FormService } from '../form/service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
})
export class SettingsComponent {
  settings: {
    [key: string]: {
      id: number;
      name: string;
      data: string;
      required: string;
      type: string;
      key: string;
      description: string;
    };
  } = {};

  bands: any = [];
  faSpinner = faSpinner;
  faAsterisk = faAsterisk;
  faCloudUpload = faCloudUpload;

  loaded = false;

  changes: any = {};
  originalValues: any = {};

  constructor(
    private dataService: DataService,
    private formService: FormService
  ) { }

  ngOnInit() {
    this.build();
  }

  async build() {
    await this.collectSettings();
    this.changes = Object.values(this.settings).map((setting) => setting.data);
    this.originalValues = Object.values(this.settings).map(
      (setting) => setting.data
    );
    this.loaded = true;
  }

  async collectSettings() {
    let settingsRaw = await this.dataService.processGet('table', {
      filter: 'settings',
    });

    const editableSettings = settingsRaw.editable;

    settingsRaw.data.forEach((row: any, index: number) => {
      this.settings[row.setting_key] = {
        id: row.id,
        name: row.name,
        data: row.setting_value,
        required: editableSettings.required[index],
        type: row.setting_type,
        key: row.setting_key,
        description: row.description,
      };
    });

    let data = await this.dataService.processGet('table', { filter: 'bands' });
    this.bands = data['display_data'];
  }

  updateInput(key: string, event: Event) {
    let value: string = (event.target as HTMLInputElement).value;
    this.update(key, value);
  }

  updateCheckInput(key: string, event: Event) {
    const isChecked = (event.target as HTMLInputElement).checked;
    const value = isChecked ? 'Yes' : 'No';
    this.update(key, value);
  }

  update(key: string, value: string) {
    this.settings[key].data = value;
    this.changes[key] = value;
  }

  getColumnHeaders(obj: { [key: string]: any }): string[] {
    return obj ? Object.keys(obj) : [];
  }

  async formSubmit() {
    let responses = [];
    let keys = Object.keys(this.settings);
    for (let i = 0; i < keys.length; i++) {
      let key = keys[i];

      if (this.settings[key].data != '') {
        responses[i] = (
          await this.dataService.submitFormData({
            action: 'append',
            table_name: 'settings',
            id: this.settings[key].id,
            setting_value: this.settings[key].data,
            setting_key: this.settings[key].key,
            description: this.settings[key].description,
            setting_type: this.settings[key].type,
            name: this.settings[key].name,
          })
        ).success;
      }
    }

    this.endSubmission(responses);
  }

  endSubmission(responses: boolean[]) {
    let title = 'Error!';
    let message =
      'There was an issue saving the settings! Make sure everything is correct before trying to save.';

    if (!responses.includes(false)) {
      title = 'Success!';
      message = 'Settings saved successfully!';

      this.changes = {};
      this.originalValues = {};
    }

    this.formService.setMessageFormData({ title, message });
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
  }
}
