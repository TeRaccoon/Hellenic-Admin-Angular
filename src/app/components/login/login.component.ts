import { Component } from '@angular/core';
import { DataService } from '../../services/data.service';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { lastValueFrom } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  loginForm: FormGroup;
  error: string | null = null;
  loaded = false;

  constructor(private router: Router, private authService: AuthService, private dataService: DataService, private fb: FormBuilder) { 
    this.loginForm = this.fb.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required]]
    });
  }

  ngOnInit() {
    this.authService.checkLogin().subscribe((response: any) => {
      if (response.success) {
        this.authService.login();
        this.router.navigate(['/home'])
      }
      this.loaded = true;
    });
    this.loginForm.addControl('action', this.fb.control('login'));
  }

  async formSubmit() {
    if (this.loginForm.valid) {
      let loginResponse = await this.dataService.submitFormData(this.loginForm.value);
      if (loginResponse.success) {
        let accessLevel = loginResponse.data == null ? 'low' : loginResponse.data;
        this.authService.login(accessLevel);
        this.router.navigate(['/home'])
      } else {
        this.error = loginResponse.message;
      }
    }
  }
}
