import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { faX } from '@fortawesome/free-solid-svg-icons';
import { Subscription } from 'rxjs';
import { DataService } from '../../services/data.service';
import { FormService } from '../form/service';

@Component({
  selector: 'app-change-password-form',
  templateUrl: './change-password-form.component.html',
  styleUrls: ['./change-password-form.component.scss'],
})
export class ChangePasswordFormComponent implements OnInit, OnDestroy {
  private readonly subscriptions = new Subscription();

  x = faX;

  formVisible = 'hidden';
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
  }

  ngOnInit() {
    this.subscriptions.add(
      this.formService.getChangePasswordFormVisibility().subscribe((visible) => {
        this.formVisible = visible ? 'visible' : 'hidden';
        if (visible) {
          this.resetForm();
          this.loadForm();
        }
      })
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
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
    this.formService.hideChangePasswordForm();
  }
}
