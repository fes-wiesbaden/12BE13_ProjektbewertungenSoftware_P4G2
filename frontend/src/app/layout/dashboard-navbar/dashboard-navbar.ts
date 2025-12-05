import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatMenuModule } from '@angular/material/menu';
import { AuthService } from '../../core/auth/auth.service';
import { SidebarService } from '../../core/services/sidebar.service';
import { CommonModule } from '@angular/common';
import { SiXMarkIcon, SiBars3Icon } from '@semantic-icons/heroicons/24/solid';
import { Router } from '@angular/router';    // ⬅️ NEU

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
    private router: Router              // ⬅️ NEU
  ) {}

  onToggleSidebar() {
    this.sidebarService.toggle();
    this.sidebarStatus = this.sidebarStatus === 'open' ? 'close' : 'open';
  }

  ngOnInit() {
    this.username = this.auth.getUsername();
    this.theme = localStorage.getItem('theme') || 'dark';
    // falls du die Rolle aus dem Token holst:
    // this.role = this.auth.getRole();
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

  goToChangePassword() {
    this.router.navigate(['/change-password']);
    this.closeMenus();
  }
}
