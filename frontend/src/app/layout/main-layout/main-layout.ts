import { Component } from '@angular/core';
import { Sidebar } from '../sidebar/sidebar';
import { DashboardNavbar } from '../dashboard-navbar/dashboard-navbar';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from "@angular/router";
import { Card } from "../../Shared/Components/card/card";

@Component({
  selector: 'app-main-layout',
  imports: [Sidebar, DashboardNavbar, CommonModule, RouterOutlet],
  templateUrl: './main-layout.html',
  styleUrl: './main-layout.css'
})
export class MainLayout {

  sidebarCollapsed = false;

  toggleSidebar() {
    this.sidebarCollapsed = !this.sidebarCollapsed;
  }
  
  closeSidebar() {
    // Only collapse on mobile
    if (window.innerWidth < 768) {
      this.sidebarCollapsed = true;
    }
  }
}
