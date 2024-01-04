import { Component } from '@angular/core';
import { DataService } from '../../services/data.service';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  loginForm: FormGroup;
  error: string | null = null;

  constructor(private router: Router, private authService: AuthService, private dataService: DataService, private fb: FormBuilder) { 
    this.loginForm = this.fb.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required]]
    });
  }

  ngOnInit() {
    this.loginForm.addControl('action', this.fb.control('login'));
  }

  formSubmit() {
    if (this.loginForm.valid) {
      this.dataService.submitFormData(this.loginForm.value).subscribe((response: any) => {
        if (response.success) {
          this.authService.login(null);
        } else {
          this.error = response.message;
          console.log(response);
        }
      });
    }
  }
}
