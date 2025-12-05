import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';

import { PageHeaderComponents } from '../../../Shared/Components/page-header/page-header';
import { UserService, ChangePasswordRequestDto } from '../../../Shared/Services/user.service';
import { AuthService } from '../../../core/auth/auth.service';

@Component({
  selector: 'app-change-password',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatIconModule,
    PageHeaderComponents,
  ],
  templateUrl: './change-password.html',
})
export class ChangePasswordComponent {
  // Felder aus dem Template
  oldPassword = '';
  newPassword = '';
  confirmPassword = '';

  loading = false;
  errorMessage = '';
  successMessage = '';

  constructor(
    private userService: UserService,
    private auth: AuthService,
  ) {}

  onSubmit(form: NgForm) {
    this.errorMessage = '';
    this.successMessage = '';

    if (form.invalid) {
      this.errorMessage = 'Bitte alle Felder korrekt ausfüllen.';
      return;
    }

    if (this.newPassword !== this.confirmPassword) {
      this.errorMessage = 'Die neuen Passwörter stimmen nicht überein.';
      return;
    }

    const username = this.auth.getUsername();
    if (!username) {
      this.errorMessage = 'Kein Benutzername gefunden. Bitte erneut einloggen.';
      return;
    }

    const dto: ChangePasswordRequestDto = {
      oldPassword: this.oldPassword,
      newPassword: this.newPassword,
    };

    this.loading = true;

    this.userService.changePassword(username, dto).subscribe({
      next: () => {
        this.successMessage = 'Passwort wurde erfolgreich geändert.';
        this.loading = false;
        form.resetForm();
      },
      error: (err: any) => {
        console.error(err);
        this.loading = false;

        if (err.status === 400) {
          this.errorMessage = 'Das alte Passwort ist falsch.';
        } else if (err.status === 404) {
          this.errorMessage = 'Benutzer nicht gefunden.';
        } else {
          this.errorMessage = 'Fehler beim Ändern des Passworts.';
        }
      },
    });
  }
}
