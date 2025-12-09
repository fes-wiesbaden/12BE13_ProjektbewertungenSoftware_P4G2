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
})
export class Login {
  loginForm: FormGroup;
  loginError: string = '';
  hasError = false;
  showForgotPassword = false;
  isLoading = false;

  constructor(private fb: FormBuilder, private auth: AuthService, private router: Router) {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', [Validators.required]],
    });

    this.loginForm.valueChanges.subscribe(() => {
      this.loginError = '';
    });
  }

  hideError() {
    this.hasError = false;
  }

  showError() {
    this.hasError = true;
  }

  async onSubmit() {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    const { username, password } = this.loginForm.value;
    const success = await this.auth.login(username, password);
    this.isLoading = false;

    if (!success) {
      this.loginError = 'Ungültiger Benutzername oder Passwort';
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
  }
}
