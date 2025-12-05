import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { UserService } from '../../../Shared/Services/user.service';
import { PageHeaderComponents } from '../../../Shared/Components/page-header/page-header';

@Component({
  selector: 'app-change-password',
  standalone: true,
  imports: [CommonModule, FormsModule, MatIconModule, PageHeaderComponents],
  templateUrl: './change-password.html',
})
export class ChangePasswordComponent {
  oldPassword = '';
  newPassword = '';
  confirmPassword = '';

  loading = false;
  errorMessage = '';
  successMessage = '';

  constructor(private userService: UserService) {}

  onSubmit(form: NgForm) {
    this.errorMessage = '';
    this.successMessage = '';

    if (this.newPassword !== this.confirmPassword) {
      this.errorMessage = 'Die neuen Passwörter stimmen nicht überein.';
      return;
    }

    if (!this.newPassword || !this.oldPassword) {
      this.errorMessage = 'Bitte alle Felder ausfüllen.';
      return;
    }

    this.loading = true;

    this.userService
      .changePassword({
        oldPassword: this.oldPassword,
        newPassword: this.newPassword,
      })
      .subscribe({
        next: () => {
          this.loading = false;
          this.successMessage = 'Passwort wurde erfolgreich geändert.';
          form.resetForm();
        },
        error: (err) => {
          this.loading = false;

          if (err.status === 400) {
            this.errorMessage = 'Das alte Passwort ist falsch.';
          } else if (err.status === 401) {
            this.errorMessage = 'Du bist nicht eingeloggt.';
          } else {
            this.errorMessage = 'Es ist ein Fehler aufgetreten. Bitte versuche es erneut.';
          }
        },
      });
  }
}
