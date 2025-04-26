import { Component } from '@angular/core';
import { DataService } from '../../services/data.service';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReCaptchaV3Service } from 'ng-recaptcha';
import { lastValueFrom, Subscription } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  standalone: false
})
export class LoginComponent {
  private readonly subscriptions = new Subscription();

  loginForm: FormGroup;
  error: string | null = null;
  loaded = false;

  constructor(
    private router: Router,
    private authService: AuthService,
    private dataService: DataService,
    private fb: FormBuilder,
    private recaptchaV3Service: ReCaptchaV3Service
  ) {
    this.loginForm = this.fb.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required]],
    });
  }

  ngOnInit() {
    this.subscriptions.add(
      this.authService.checkLogin().subscribe((response: any) => {
        if (response.success) {
          this.authService.login();
          this.router.navigate(['/home']);
        }
        this.loaded = true;
      })
    );
    this.loginForm.addControl('action', this.fb.control('login'));
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  async formSubmit() {
    if (this.loginForm.valid) {
      try {
        const token = await lastValueFrom(
          this.recaptchaV3Service.execute('loginAction')
        );
        this.loginForm.value.recaptchaToken = token;

        const loginResponse = await this.dataService.submitFormData(
          this.loginForm.value
        );
        if (loginResponse.success) {
          const accessLevel =
            loginResponse.data == null ? 'Low' : loginResponse.data;
          this.authService.login(accessLevel);
          this.router.navigate(['/home']);
        } else {
          this.error = loginResponse.message;
        }
      } catch (error) {
        this.error = 'reCAPTCHA verification failed. Please try again.';
      }
    } else {
      this.loginForm.markAllAsTouched();
    }
  }
}
