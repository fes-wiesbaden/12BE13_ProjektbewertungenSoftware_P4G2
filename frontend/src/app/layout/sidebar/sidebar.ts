import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../../core/auth/auth.service';
import { ɵInternalFormsSharedModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SidebarService } from '../../core/services/sidebar.service';
import { MenuItem } from '../../Shared/models/sidebar.interface';
import { TranslationService } from '../../core/services/translation.service';


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
    private sidebarService: SidebarService, public i18n: TranslationService
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
      { icon: 'dashboard', label: this.i18n.t('sidebar.overview'), route: '/admin/dashboard' },
      {
        icon: 'group',
        label: this.i18n.t('sidebar.users'),
        route: '/admin/users',
        subMenu: [
          { icon: 'shield_person', label: this.i18n.t('sidebar.admin'), route: '/admin/manage-admin' },
          { icon: 'assignment_ind', label: this.i18n.t('sidebar.teacher'), route: '/admin/manage-teachers' },
          { icon: 'person', label: this.i18n.t('sidebar.student'), route: '/admin/manage-students' },
        ],
      },
      { icon: 'groups', label: this.i18n.t('sidebar.classes'), route: '/admin/manage-classes' },
      { icon: 'help_outlined', label: this.i18n.t('sidebar.questions'), route: '/admin/manage-questions' },
      { icon: 'school', label: this.i18n.t('sidebar.learningFields'), route: '/admin/manage-learningfields' },
    ],

    teacher: [
      { icon: 'groups', label: this.i18n.t('sidebar.myCourses'), route: '/teacher/dashboard' },
      {
        icon: 'manage_accounts',
        label: this.i18n.t('sidebar.management'),
        route: '',
        subMenu: [
          { icon: 'group', label: this.i18n.t('sidebar.projectGroup'), route: '/teacher/groups' },
          { icon: 'assignment', label: this.i18n.t('sidebar.projects'), route: '/teacher/projects' },
        ],
      },
    ],

    student: [
      { icon: 'dashboard', label: this.i18n.t('sidebar.overview'), route: '/student/dashboard' },
      { icon: 'group', label: this.i18n.t('sidebar.myGroup'), route: '/student/my-classes' },
      { icon: 'assignment_ind', label: this.i18n.t('sidebar.myGrades'), route: '/student/my-profile' },
      { icon: 'assignment', label: this.i18n.t('sidebar.assessment'), route: '/student/my-assessment' },
    ],
  };

  return menus[role] || [];
}
}
