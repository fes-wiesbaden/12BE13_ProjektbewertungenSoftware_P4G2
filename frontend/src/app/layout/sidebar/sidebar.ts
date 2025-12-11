import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../../core/auth/auth.service';
import { ɵInternalFormsSharedModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SidebarService } from '../../core/services/sidebar.service';
import { MenuItem } from '../../Shared/models/sidebar.interface';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [MatIconModule, ɵInternalFormsSharedModule, CommonModule, RouterModule],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css',
})
export class Sidebar implements OnInit {
  @Input() isCollapsed = false;
  @Output() sidebarClose = new EventEmitter<void>();

  sidebarStatus: string = 'open';
  menuItems: MenuItem[] = [];

  constructor(
    private auth: AuthService,
    private sidebarService: SidebarService,
  ) {}

  ngOnInit() {
    const role = this.auth.getRole();
    this.menuItems = this.getMenuForRole(role);

    this.sidebarService.isCollapsed$.subscribe((collapsed) => (this.isCollapsed = collapsed));
  }

  logout() {
    this.auth.logout();
  }

  toggleSidebar() {
    this.isCollapsed = !this.isCollapsed;
  }

  getMenuForRole(role: string): MenuItem[] {
    const menus: { [key: string]: MenuItem[] } = {
      admin: [
        { icon: 'dashboard', label: 'Übersicht', route: '/admin/dashboard' },
        {
          icon: 'group',
          label: 'Nutzer',
          route: '/admin/users',
          subMenu: [
            { icon: 'shield_person', label: 'Admin', route: '/admin/manage-admin' },
            { icon: 'assignment_ind', label: 'Lehrer', route: '/admin/manage-teachers' },
            { icon: 'person', label: 'Schüler', route: '/admin/manage-students' },
          ],
        },
        { icon: 'groups', label: 'Klassen', route: '/admin/manage-classes' },
        { icon: 'help_outlined', label: 'Fragen', route: '/admin/manage-questions' },
        { icon: 'school', label: 'Lernfelder', route: '/admin/manage-learningfields' },
      ],
      teacher: [
        { icon: 'groups', label: 'Meine Kurse', route: '/teacher/dashboard' },
        {
          icon: 'manage_accounts',
          label: 'Verwaltung',
          route: '',
          subMenu: [
            { icon: 'group', label: 'Projektgruppe', route: '/teacher/groups' },
            { icon: 'assignment', label: 'Projekte', route: '/teacher/projects' },
          ],
        },
      ],
      student: [
        { icon: 'dashboard', label: 'Übersicht', route: '/student/dashboard' },
        { icon: 'group', label: 'Meine Gruppe', route: '/student/my-classes' },
        { icon: 'assignment_ind', label: 'Meine Noten', route: '/student/my-profile' },
        { icon: 'assignment', label: 'Selbst-/Fremdbewertung', route: '/student/my-assessment' },
      ],
    };
    return menus[role] || [];
  }
}
