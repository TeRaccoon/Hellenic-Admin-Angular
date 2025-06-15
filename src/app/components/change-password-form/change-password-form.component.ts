import { Component, effect } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DataService } from '../../services/data.service';
import { FormService } from '../form/service';
import { FormType } from '../form/types';
import { ICONS } from './icons';

@Component({
  selector: 'app-change-password-form',
  templateUrl: './change-password-form.component.html',
  styleUrls: ['./change-password-form.component.scss'],
})
export class ChangePasswordFormComponent {
  icons = ICONS;

  visible = false;
  changePasswordForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private dataService: DataService,
    private formService: FormService
  ) {
    this.changePasswordForm = this.fb.group({
      username: ['', Validators.required],
      current_password: ['', Validators.required],
      new_password: ['', Validators.required],
    });

    effect(() => {
      const visible = this.formService.getFormVisibilitySignal(FormType.ChangePassword)();
      this.visible = visible;
      if (visible) {
        this.resetForm();
        this.loadForm();
      }
    });
  }

  resetForm() {
    this.changePasswordForm = this.fb.group({
      username: ['', Validators.required],
      current_password: ['', Validators.required],
      new_password: ['', Validators.required],
    });
    this.changePasswordForm.reset();
  }

  loadForm() {
    this.changePasswordForm.addControl('action', this.fb.control('change-password'));
  }

  async formSubmit() {
    const submissionResponse = await this.dataService.submitFormData(this.changePasswordForm.value);
    this.formService.setMessageFormData({
      title: submissionResponse.success ? 'Success!' : 'Error!',
      message: submissionResponse.message,
    });
    this.hide();
    this.formService.requestReload();
  }

  hide() {
    this.formService.setFormVisibility(FormType.ChangePassword, false);
  }
}
