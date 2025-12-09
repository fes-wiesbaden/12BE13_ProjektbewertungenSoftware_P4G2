import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatMenuModule } from '@angular/material/menu';
import { AuthService } from '../../core/auth/auth.service';
import { SidebarService } from '../../core/services/sidebar.service';
import { CommonModule } from '@angular/common';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  FormsModule,
  NgForm,
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
    FormsModule,
    MatIconModule,
    MatToolbarModule,
    MatButtonModule,
    MatMenuModule,
    SiXMarkIcon,
    SiBars3Icon,
    ReactiveFormsModule
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
    private userService: UserService
  ) {
    this.changePasswordForm = this.fb.group(
      {
        oldPassword: ['', Validators.required],
        newPassword: [
          '',
          [
            Validators.required,
            Validators.minLength(8),
            Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).+$/), // Groß/klein, Zahl, Sonderzeichen
          ],
        ],
        confirmPassword: ['', Validators.required],
      },
      { validators: this.passwordsMatch }
    );
  }

  ngOnInit() {
    this.username = this.authService.getUsername();
    this.role = this.authService.getRole();
    this.theme = localStorage.getItem('theme') || 'dark';
  }

  passwordsMatch(group: AbstractControl): ValidationErrors | null {
    const newPwd = group.get('newPassword')?.value;
    const confirmPwd = group.get('confirmPassword')?.value;
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
