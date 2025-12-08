import { Component, OnInit } from '@angular/core';
import { AdminService } from './admin.service';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AddUser, User } from '../../../Interfaces/user.interface';
import { AuthService } from '../../../core/auth/auth.service';
import {
  TableColumn,
  TableColumnComponent,
} from '../../../Shared/Components/table-column/table-column';
import { FormField, FormModalComponent } from '../../../Shared/Components/form-modal/form-modal';
import { PageHeaderComponents } from '../../../Shared/Components/page-header/page-header';
import { DeleteButtonComponent } from '../../../Shared/Components/delete-button/delete-button';

@Component({
  selector: 'app-manage-admin',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    FormsModule,
    PageHeaderComponents,
    TableColumnComponent,
    FormModalComponent,
    DeleteButtonComponent,
  ],
  templateUrl: './manage-admin.html',
})
export class ManageAdmins implements OnInit {
  admins: User[] = [];
  classes: { label: string; value: any }[] = [];
  loading = true;

  showAddModel: boolean = false;
  showEditModal: boolean = false;
  showDeleteModal: boolean = false;

  columns: TableColumn<User>[] = [
    { key: 'firstName', label: 'First Name' },
    { key: 'lastName', label: 'Last Name' },
    { key: 'username', label: 'Username' },
    { key: 'roleName', label: 'Role' },
  ];

  fields: FormField[] = [
    {
      key: 'firstName',
      label: 'First Name',
      type: 'text',
      required: true,
      colSpan: 3,
      placeholder: 'Vorname',
    },
    {
      key: 'lastName',
      label: 'Last Name',
      type: 'text',
      required: true,
      colSpan: 3,
      placeholder: 'Nachname',
    },
    {
      key: 'username',
      label: 'Username',
      type: 'text',
      required: true,
      colSpan: 3,
      placeholder: 'Benutzername',
    },
    {
      key: 'courseId',
      label: 'Kursname',
      type: 'select',
      readonly: true,
      colSpan: 3,
      options: [],
    },
    {
      key: 'password',
      label: 'Password',
      type: 'password',
      required: true,
      colSpan: 3,
      placeholder: 'Passwort',
    },
    {
      key: 'confirmPassword',
      label: 'Passwort wiederholen',
      type: 'password',
      required: true,
      colSpan: 3,
      placeholder: 'Passwort wiederholen',
    },
  ];

  fieldsEdit: FormField[] = [
    {
      key: 'firstName',
      label: 'Vorname',
      type: 'text',
      required: true,
      colSpan: 3,
      placeholder: 'Vorname',
    },
    {
      key: 'lastName',
      label: 'Nachname',
      type: 'text',
      required: true,
      colSpan: 3,
      placeholder: 'Nachname',
    },
    {
      key: 'username',
      label: 'Benutzername',
      type: 'text',
      required: true,
      colSpan: 3,
      placeholder: 'Benutzername',
    },
  ];

  firstName = '';
  lastName = '';
  username = '';
  password = '';
  confirmPassword = '';
  role = '';

  editingAdmin: User | null = null;
  deletingAdmin: User | null = null;

  constructor(private adminService: AdminService, private authService: AuthService) {}

  ngOnInit(): void {
    this.loadAdmin();
    this.loadAllClasses();
  }

  openAddModel(): void {
    this.showAddModel = true;
  }

  closeAddModel(): void {
    this.showAddModel = false;
  }

  openEditModal(admin: User) {
    this.editingAdmin = admin;
    this.showEditModal = true;
  }

  closeEditModal() {
    this.showEditModal = false;
    this.editingAdmin = null;
  }

  openDeleteModal(admin: User) {
    this.deletingAdmin = admin;
    this.showDeleteModal = true;
  }

  closeDeleteModal() {
    this.showDeleteModal = false;
    this.deletingAdmin = null;
  }

  saveEdit(formData: any) {
    if (!this.editingAdmin) return;

    const updatedAdmin = { ...this.editingAdmin, ...formData };

    console.log(formData);
    console.log(updatedAdmin.id);

    this.adminService.updateAdmin(updatedAdmin).subscribe({
      next: (res: User) => {
        const index = this.admins.findIndex((s) => s.id === updatedAdmin.id);
        if (index !== -1) this.admins[index] = res;
        this.closeEditModal();
      },
      error: (err: any) => console.error('Fehler beim Aktualisieren:', err),
    });
  }

  loadAdmin() {
    this.adminService.getAdmins().subscribe({
      next: (data) => {
        console.log('API Data:', data);
        this.admins = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Fehler beim Laden der Admins', err);
        this.loading = false;
      },
    });
  }

  saveAdmin(formData: any) {
    let courseIds: any[] = [];
    if (Array.isArray(formData.courseId)) {
      courseIds = formData.courseId;
    } else if (formData.courseId) {
      if (typeof formData.courseId === 'object' && 'value' in formData.courseId) {
        courseIds = [formData.courseId.value];
      } else {
        courseIds = [formData.courseId];
      }
    }

    const dto: AddUser = {
      firstName: formData.firstName,
      lastName: formData.lastName,
      username: formData.username,
      password: formData.password,
      role: 3,
      courseId: courseIds,
    };

    this.adminService.createAdmin(dto).subscribe({
      next: (adminUser) => {
        this.admins.push(adminUser);
        this.closeAddModel();
        this.firstName = '';
        this.lastName = '';
        this.username = '';
        this.password = '';
        this.role = '';
      },
      error: (err) => console.error('Fehler beim Erstellen:', err),
    });
  }

  deleteAdmin() {
    if (!this.deletingAdmin) return;

    this.adminService.deleteAdmin(this.deletingAdmin).subscribe({
      next: () => {
        this.admins = this.admins.filter((s) => s.id !== this.deletingAdmin!.id);
      },
      error: (err) => console.error('Fehler beim Löschen', err),
    });
  }

  loadAllClasses() {
    this.adminService.getClasses().subscribe({
      next: (data) => {
        const formatted = data.map((c) => ({
          label: c.courseName,
          value: c.id,
        }));

        this.classes = formatted;

        const courseField = this.fields.find((f) => f.key === 'courseId');
        if (courseField) {
          courseField.options = formatted;
        }

        this.loading = false;
      },
      error: (err) => {
        console.error('Fehler beim Laden der Klassen', err);
        this.loading = false;
      },
    });
  }
}
