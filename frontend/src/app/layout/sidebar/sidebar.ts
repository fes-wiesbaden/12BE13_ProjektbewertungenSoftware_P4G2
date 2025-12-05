import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../../core/auth/auth.service';
import { SidebarItem } from '../../Shared/interfaces/sidebar-item.interface';
import { ɵInternalFormsSharedModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, RouterModule, RouterOutlet } from '@angular/router';
import { SidebarService } from '../../core/services/sidebar.service';

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
  menuItems: SidebarItem[] = [];

  constructor(
    private auth: AuthService,
    private router: Router,
    private sidebarService: SidebarService
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

  getMenuForRole(role: string): SidebarItem[] {
    const menus: { [key: string]: SidebarItem[] } = {
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
        { icon: 'help_outlined', label: 'Lernfelder', route: '/admin/manage-learningfields' },
      ],
      teacher: [
        { icon: 'dashboard', label: 'Übersicht', route: '/teacher/dashboard' },
        {
          icon: 'manage_accounts',
          label: 'Verwaltung',
          route: '',
          subMenu: [
            { icon: 'person', label: 'Schüler', route: '/teacher/my-students' },
            { icon: 'group', label: 'Projektgruppe', route: '/teacher/groups' },
            { icon: 'assignment', label: 'Projekte', route: '/teacher/projects' },
          ],
        },
        { icon: 'groups', label: 'Meine Klassen', route: '/teacher/my-classes' },
        { icon: 'mode_heat', label: 'Notenverwaltung', route: '/teacher/manage-grades' },
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
