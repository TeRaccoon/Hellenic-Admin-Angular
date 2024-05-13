import { Component } from '@angular/core';
import { DataService } from '../../services/data.service';
import { FormService } from '../../services/form.service';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { lastValueFrom } from 'rxjs';

@Component({
  selector: 'app-change-password-form',
  templateUrl: './change-password-form.component.html',
  styleUrls: ['./change-password-form.component.scss']
})
export class ChangePasswordFormComponent {
  formVisible = 'hidden';
  changePasswordForm: FormGroup;

  constructor(private fb: FormBuilder, private dataService: DataService, private formService: FormService, private authService: AuthService, private router: Router) {
    this.changePasswordForm = this.fb.group({
      username: ['', Validators.required],
      current_password: ['', Validators.required],
      new_password: ['', Validators.required],
    });
  }

  ngOnInit() {
    this.formService.getChangePasswordFormVisibility().subscribe((visible) => {
      this.formVisible = visible ? 'visible' : 'hidden';
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
    let submissionResponse = await this.dataService.submitFormData(this.changePasswordForm.value);
    this.formService.setMessageFormData({
      title: submissionResponse.success ? 'Success!' : 'Error!',
      message: submissionResponse.message,
    });
    this.formService.showMessageForm();
    this.hide();
    this.formService.requestReload();
  }

  hide() {
    this.formService.hideChangePasswordForm();
  }
}
