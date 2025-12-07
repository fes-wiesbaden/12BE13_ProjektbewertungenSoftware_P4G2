import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatMenuModule } from '@angular/material/menu';
import { AuthService } from '../../core/auth/auth.service';
import { SidebarService } from '../../core/services/sidebar.service';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { SiXMarkIcon, SiBars3Icon } from '@semantic-icons/heroicons/24/solid';
import { UserService, ChangePasswordRequestDto } from '../../Shared/Services/user.service';
import { Router } from '@angular/router';

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
    SiBars3Icon
  ],
  templateUrl: './dashboard-navbar.html',
  styleUrl: './dashboard-navbar.css',
})
export class DashboardNavbar implements OnInit {
  @Output() sidebarToggle = new EventEmitter<void>();
  theme: string = 'dark';
  username: string = 'John Doe';
  role: string = 'Admin';
  sidebarStatus: string = 'close';
  notificationMenuOpen: boolean = false;
  profileMenuOpen: boolean = false;

  constructor(
    private auth: AuthService,
    private sidebarService: SidebarService,
    private router: Router,
    private userService: UserService
  ) {}

  onToggleSidebar() {
    this.sidebarService.toggle();
    this.sidebarStatus = this.sidebarStatus === 'open' ? 'close' : 'open';
  }

  ngOnInit() {
    this.username = this.auth.getUsername();
    this.theme = localStorage.getItem('theme') || 'dark';

  }

  changeTheme() {
    this.theme = this.theme === 'light' ? 'dark' : 'light';
    localStorage.setItem('theme', this.theme);
  }

  toggleNotificationMenu() {
    this.notificationMenuOpen = !this.notificationMenuOpen;
    if (this.notificationMenuOpen) {
      this.profileMenuOpen = false;
    }
  }

  toggleProfileMenu() {
    this.profileMenuOpen = !this.profileMenuOpen;
    if (this.profileMenuOpen) {
      this.notificationMenuOpen = false;
    }
  }

  closeMenus() {
    this.notificationMenuOpen = false;
    this.profileMenuOpen = false;
  }

  signOut() {
    this.auth.logout();
  }

  openChangePasswordModal() {
    this.errorMessage = '';
    this.successMessage = '';
    this.oldPassword = '';
    this.newPassword = '';
    this.confirmPassword = '';
    this.showChangePasswordModal = true;
  }

  closeChangePasswordModal() {
    this.showChangePasswordModal = false;
  }

  submitChangePassword(form: NgForm) {
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
        this.closeChangePasswordModal();
      },
      error: (err) => {
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

//
//   goToChangePassword() {
//     this.router.navigate(['/change-password']);
//     this.closeMenus();
//   }
}
