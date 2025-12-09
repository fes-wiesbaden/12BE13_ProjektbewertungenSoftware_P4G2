import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/auth/auth.service';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, MatIconModule],
  templateUrl: './login.html',
  styleUrls: ['./login.css'],
})
export class Login {
  loginForm: FormGroup;
  loginError: string = '';
  hasError = false;
  showForgotPassword = false;

  constructor(private fb: FormBuilder, private auth: AuthService, private router: Router) {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', [Validators.required]],
    });
  }

  hideError() {
    this.hasError = false;
  }

  showError() {
    this.hasError = true;
  }

  async onSubmit() {
    console.log('🔵 onSubmit called');
    console.log('Form valid:', this.loginForm.valid);
    console.log('Form values:', this.loginForm.value);

    if (this.loginForm.invalid) {
      console.log('❌ Form is invalid');
      return;
    }

    const { username, password } = this.loginForm.value;
    console.log('📤 Attempting login...');

    const success = await this.auth.login(username, password);
    console.log('✅ Login result:', success);

    if (!success) {
      console.log('❌ Login failed');
      this.loginError = 'Invalid username or password';
      this.showError();
      return;
    }

    const role = this.auth.getRole().toLowerCase();
    console.log('User role:', role);

    switch (role) {
      case 'teacher':
        this.router.navigate(['/teacher/dashboard']);
        break;
      case 'student':
        this.router.navigate(['/student/dashboard']);
        break;
      case 'admin':
        this.router.navigate(['/admin/dashboard']);
        break;
      default:
        this.router.navigate(['/auth/login']);
        break;
    }

    console.log('✅ Navigation triggered');
  }
}
