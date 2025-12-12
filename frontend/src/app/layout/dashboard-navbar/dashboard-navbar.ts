import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatMenuModule } from '@angular/material/menu';
import { AuthService } from '../../core/auth/auth.service';
import { SidebarService } from '../../core/services/sidebar.service';
import { CommonModule } from '@angular/common';
import { TranslationService } from '../../core/services/translation.service';

import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { SiXMarkIcon, SiBars3Icon } from '@semantic-icons/heroicons/24/solid';
import { UserService } from '../../Shared/Services/user.service';
import { UserChangePassword } from '../../Shared/models/user.interface';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-dashboard-navbar',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatToolbarModule,
    MatButtonModule,
    MatMenuModule,
    SiXMarkIcon,
    SiBars3Icon,
    ReactiveFormsModule,
  ],
  templateUrl: './dashboard-navbar.html',
  styleUrl: './dashboard-navbar.css',
})
export class DashboardNavbar implements OnInit {
  changePasswordForm: FormGroup;
  showChangePasswordModal = false;
  loading = false;
  successMessage = '';
  errorMessage = '';
  private static readonly PASSWORD_PATTERN = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).+$/;

  @Output() sidebarToggle = new EventEmitter<void>();

  theme: string = 'dark';
  username: string = '';
  role: string = '';
  sidebarStatus: string = 'close';
  profileMenuOpen: boolean = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private sidebarService: SidebarService,
    private userService: UserService,
    public i18n: TranslationService,
  ) {
    this.changePasswordForm = this.fb.group(
      {
        oldPassword: ['', Validators.required],
        newPassword: [
          '',
          [
            Validators.required,
            Validators.minLength(8),
            Validators.pattern(DashboardNavbar.PASSWORD_PATTERN),
          ],
        ],
        confirmPassword: ['', Validators.required],
      },
      { validators: this.passwordsMatch },
    );
  }

  toggleLang() {
  const next = this.i18n.getLang() === 'de' ? 'en' : 'de';
  this.i18n.setLang(next);
  localStorage.setItem('lang', next);
}

  ngOnInit() {
    this.username = this.authService.getUsername();
    this.role = this.authService.getRole();
    this.theme = localStorage.getItem('theme') || 'dark';
    const savedLang = (localStorage.getItem('lang') as 'de' | 'en') || 'de';
    this.i18n.setLang(savedLang);
  }

  passwordsMatch(group: AbstractControl): ValidationErrors | null {
    const newPwd = group.get('newPassword')?.value;
    const confirmPwd = group.get('confirmPassword')?.value;

    if (!newPwd || !confirmPwd) {
      return null;
    }

    return newPwd === confirmPwd ? null : { notMatching: true };
  }

  openChangePasswordModal() {
    this.showChangePasswordModal = true;
    this.successMessage = '';
    this.errorMessage = '';
    this.changePasswordForm.reset();
  }

  closeChangePasswordModal() {
    this.showChangePasswordModal = false;
    this.successMessage = '';
    this.errorMessage = '';
  }

  submitChangePassword() {
    if (this.changePasswordForm.invalid) {
      this.errorMessage = 'Bitte alle Felder korrekt ausfüllen.';
      return;
    }

    const username = this.authService.getUsername();
    if (!username) {
      this.errorMessage = 'Kein Benutzername gefunden. Bitte erneut einloggen.';
      return;
    }

    const dto: UserChangePassword = {
      oldPassword: this.changePasswordForm.value.oldPassword,
      newPassword: this.changePasswordForm.value.newPassword,
    };

    this.loading = true;

    this.userService
      .changePassword(username, dto)
      .pipe(finalize(() => (this.loading = false)))
      .subscribe({
        next: () => {
          this.successMessage = 'Passwort erfolgreich geändert!';
          this.changePasswordForm.reset();
          this.closeChangePasswordModal();
        },
        error: (err) => {
          if (err.status === 400) this.errorMessage = 'Das alte Passwort ist falsch.';
          else if (err.status === 404) this.errorMessage = 'Benutzer nicht gefunden.';
          else this.errorMessage = 'Fehler beim Ändern des Passworts.';
        },
      });
  }

  onToggleSidebar() {
    this.sidebarService.toggle();
    this.sidebarStatus = this.sidebarStatus === 'open' ? 'close' : 'open';
  }

  changeTheme() {
    this.theme = this.theme === 'light' ? 'dark' : 'light';
    localStorage.setItem('theme', this.theme);
  }

  toggleProfileMenu() {
    this.profileMenuOpen = !this.profileMenuOpen;
  }

  closeMenus() {
    this.profileMenuOpen = false;
  }

  signOut() {
    this.authService.logout();
  }
}
