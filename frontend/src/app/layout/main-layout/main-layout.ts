import { Component } from '@angular/core';
import { Sidebar } from '../sidebar/sidebar';
import { DashboardNavbar } from '../dashboard-navbar/dashboard-navbar';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-main-layout',
  imports: [Sidebar, DashboardNavbar, CommonModule, RouterOutlet],
  templateUrl: './main-layout.html'
})
export class MainLayout {
  sidebarCollapsed = false;

  toggleSidebar() {
    this.sidebarCollapsed = !this.sidebarCollapsed;
  }

  closeSidebar() {
    if (window.innerWidth < 768) {
      this.sidebarCollapsed = true;
    }
  }
}
