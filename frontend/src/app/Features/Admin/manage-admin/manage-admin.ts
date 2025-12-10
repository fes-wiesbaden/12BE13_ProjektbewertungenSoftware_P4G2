import { Component, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  TableColumn,
  TableColumnComponent,
} from '../../../Shared/Components/table-column/table-column';
import { FormField, FormModalComponent } from '../../../Shared/Components/form-modal/form-modal';
import { PageHeaderComponents } from '../../../Shared/Components/page-header/page-header';
import { DeleteButtonComponent } from '../../../Shared/Components/delete-button/delete-button';
import { ImportModalComponent } from '../../../Shared/Components/import-modal/import-modal';
import { ExportModalComponent } from '../../../Shared/Components/export-modal/export-modal';
import { User, AddUser, UserResetPassword } from '../../../Shared/models/user.interface';
import { UserService } from '../../../Shared/Services/user.service';
import { ResetPassword } from '../../../Shared/Components/reset-password/reset-password';

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
    ImportModalComponent,
    ExportModalComponent,
    ResetPassword,
  ],
  templateUrl: './manage-admin.html',
})
export class ManageAdmins implements OnInit {
  admins: User[] = [];
  classes: { label: string; value: any }[] = [];
  loading = true;
  showImportModal = false;
  showExportModal = false;
  onImportFile(file: File) {
    console.log('Import-Datei:', file);
  }
  showAddModel: boolean = false;
  showEditModal: boolean = false;
  showDeleteModal: boolean = false;
  showResetModal = false;
  tempPassword: string = '';

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
      key: 'roleId',
      label: 'Rolle',
      type: 'text',
      readonly: true,
      colSpan: 3,
      value: 'Administrator',
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

  editingAdmin: User | null = null;
  deletingAdmin: User | null = null;

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.loadAdmin();
  }

  openAddModel(): void {
    this.showAddModel = true;
  }

  closeAddModel(): void {
    this.showAddModel = false;
  }

  openResetModal(password: string) {
    this.tempPassword = password;
    this.showResetModal = true;
  }

  closeResetModel() {
    this.showResetModal = false;
    this.tempPassword = '';
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

    this.userService.updateUser(updatedAdmin).subscribe({
      next: (res: User) => {
        const index = this.admins.findIndex((s) => s.id === updatedAdmin.id);
        if (index !== -1) this.admins[index] = res;
        this.closeEditModal();
      },
      error: (err: any) => console.error('Fehler beim Aktualisieren:', err),
    });
  }

  loadAdmin() {
    this.userService.getUsersByRoleId(3).subscribe({
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

    this.userService.createUserByRoleId(3, dto).subscribe({
      next: (adminUser) => {
        this.admins.push(adminUser);
        this.closeAddModel();
      },
      error: (err) => console.error('Fehler beim Erstellen:', err),
    });
  }

  deleteAdmin() {
    if (!this.deletingAdmin) return;

    const idToDelete = this.deletingAdmin.id;
    this.userService.deleteUser(this.deletingAdmin).subscribe({
      next: () => {
        this.admins = this.admins.filter((s) => s.id !== idToDelete);
        this.deletingAdmin = null;
        this.closeDeleteModal();
      },
      error: (err) => console.error('Fehler beim Löschen', err),
    });
  }

  onResetPassword(user: User) {
    var userId = user.id;
    this.tempPassword = this.generateTempPassword();

    const dto: UserResetPassword = {
      newPassword: this.tempPassword,
    };

    this.userService.resetPassword(userId, dto).subscribe({
      next: () => {
        console.log('Passwort erfolgreich zurückgesetzt');
      },
      error: (err) => {
        console.error('Fehler beim Zurücksetzen des Passworts', err);
      },
    });
  }

  generateTempPassword(): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()';
    let pass = '';
    for (let i = 0; i < 12; i++) {
      pass += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return pass;
  }
}
