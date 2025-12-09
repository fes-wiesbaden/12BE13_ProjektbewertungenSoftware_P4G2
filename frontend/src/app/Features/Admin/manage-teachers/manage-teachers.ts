import { Component, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PageHeaderComponents } from '../../../Shared/Components/page-header/page-header';
import {
  TableColumn,
  TableColumnComponent,
} from '../../../Shared/Components/table-column/table-column';
import { FormField, FormModalComponent } from '../../../Shared/Components/form-modal/form-modal';
import { DeleteButtonComponent } from '../../../Shared/Components/delete-button/delete-button';
import { ImportModalComponent } from '../../../Shared/Components/import-modal/import-modal';
import { ExportModalComponent } from '../../../Shared/Components/export-modal/export-modal';
import { UserService } from '../../../Shared/Services/user.service';
import { User } from '../../../Shared/models/user.interface';
import { CourseService } from '../../../Shared/Services/course.service';

@Component({
  selector: 'app-manage-teachers',
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
  ],
  templateUrl: './manage-teachers.html',
})
export class ManageTeachers implements OnInit {
  teachers: User[] = [];
  courses: { label: string, value: number }[] = [];
  loading = true;
  showImportModal = false;
  showExportModal = false;
  onImportFile(file: File) {
    console.log('Import-Datei:', file);
  }
  columns: TableColumn<User>[] = [
    { key: 'firstName', label: 'First Name' },
    { key: 'lastName', label: 'Last Name' },
    { key: 'username', label: 'Username' },
    { key: 'roleName', label: 'Role' },
  ];

  fieldsNew: FormField[] = [
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
    {
      key: 'courseId',
      label: 'Kurs',
      type: 'multiselect',
      colSpan: 3,
      options: []
    },
    {
      key: 'password',
      label: 'Passwort',
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
    {
      key: 'courseId',
      label: 'Kurs',
      type: 'multiselect',
      colSpan: 3,
      options: [],
    },
  ];

  showAddModel: boolean = false;
  showEditModal: boolean = false;
  showDeleteModal: boolean = false;

  editingTeacher: User | null = null;
  deletingTeacher: User | null = null;

  firstName = '';
  lastName = '';
  username = '';
  password = '';
  role = '';

  constructor(private userService: UserService, private courseService: CourseService) {}

  ngOnInit(): void {
    this.loadTeachers();
    this.loadCourses();
  }


  openEditModal(teacher: User) {
    this.editingTeacher = teacher;
    this.showEditModal = true;
  }

  closeEditModal() {
    this.showEditModal = false;
    this.editingTeacher = null;
  }

  openAddModel(): void {
    this.showAddModel = true;
  }

  closeAddModel(): void {
    this.showAddModel = false;
  }
  openDeleteModal(teacher: User) {
    this.deletingTeacher = teacher;
    this.showDeleteModal = true;
  }
  closeDeleteModal() {
    this.showDeleteModal = false;
    this.deletingTeacher = null;
  }

  saveEdit(formData: any) {
    if (!this.editingTeacher) return;

    const updatedTeacher = { ...this.editingTeacher, ...formData };

    this.userService.updateUser(updatedTeacher).subscribe({
      next: (res: User) => {
        const index = this.teachers.findIndex((s) => s.id === updatedTeacher.id);
        if (index !== -1) this.teachers[index] = res;
        this.closeEditModal();
      },
      error: (err: any) => console.error('Fehler beim Aktualisieren:', err),
    });
  }

  loadTeachers() {
    this.userService.getUsersByRoleId(1).subscribe({
      next: (data) => {
        console.log('API Data:', data);
        this.teachers = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Fehler beim Laden der Lehrer', err);
        this.loading = false;
      },
    });
  }

  saveTeacher(formData: any) {
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

    const dto = {
      firstName: formData.firstName,
      lastName: formData.lastName,
      username: formData.username,
      password: formData.password,
      role: 1,
      courseId: courseIds,
    };

    this.userService.createUserByRoleId(1, dto).subscribe({
      next: (teacher) => {
        this.teachers.push(teacher);
        this.closeAddModel();
        this.firstName = '';
        this.lastName = '';
        this.username = '';
        this.password = '';
        this.role = '';
        console.log(teacher);
      },
      error: (err) => console.error('Fehler beim Erstellen:', err),
    });
  }

  deleteTeacher() {
    if (!this.deletingTeacher) return;

    this.userService.deleteUser(this.deletingTeacher).subscribe({
      next: () => {
        this.teachers = this.teachers.filter((s) => s.id !== this.deletingTeacher!.id);
      },
      error: (err) => console.error('Fehler beim Löschen', err),
    });
  }

  loadCourses() {
  this.courseService.getAllCourses().subscribe({
    next: (data) => {
      this.courses = data.map((c: any) => ({ label: c.courseName, value: c.id }));

      const courseField = this.fieldsNew.find(f => f.key === 'courseId');
      if (courseField) {
        courseField.options = this.courses.map(c => ({ ...c, selected: false }));
      }
      const courseFieldEdit = this.fieldsEdit.find(f => f.key === 'courseId');
      if (courseFieldEdit) {
        courseFieldEdit.options = this.courses.map(c => ({ ...c, selected: false }));
      }
    },
    error: (err) => console.error('Fehler beim Laden der Kurse:', err)
  });
}
}
