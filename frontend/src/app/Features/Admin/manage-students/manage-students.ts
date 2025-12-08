import { Component, OnInit } from '@angular/core';
import { AddUser, User } from '../../../Interfaces/user.interface';
import { StudentService } from './student.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { PageHeaderComponents } from '../../../Shared/Components/page-header/page-header';
import {
  TableColumn,
  TableColumnComponent,
} from '../../../Shared/Components/table-column/table-column';
import { FormField, FormModalComponent } from '../../../Shared/Components/form-modal/form-modal';
import { DeleteButtonComponent } from '../../../Shared/Components/delete-button/delete-button';

@Component({
  selector: 'app-manage-students',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatIconModule,
    PageHeaderComponents,
    TableColumnComponent,
    FormModalComponent,
    DeleteButtonComponent,
  ],
  templateUrl: './manage-students.html',
})
export class ManageStudents implements OnInit {
  students: User[] = [];
  classes: { label: string; value: any }[] = [];
  loading = true;

  columns: TableColumn<User>[] = [
    { key: 'firstName', label: 'First Name' },
    { key: 'lastName', label: 'Last Name' },
    { key: 'username', label: 'Username' },
    { key: 'roleName', label: 'Rollen Name' },
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
      required: true,
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

  showAddModel: boolean = false;
  showEditModal: boolean = false;
  showDeleteModal: boolean = false;

  editingStudent: User | null = null;
  deletingStudent: User | null = null;

  firstName = '';
  lastName = '';
  username = '';
  password = '';
  role = '';

  tempPassword: string | null = null;
  delete: any;

  constructor(private studentService: StudentService) {}

  ngOnInit(): void {
    this.loadStudents();
    this.loadAllClasses();
  }

  openEditModal(student: User) {
    this.editingStudent = student;
    this.showEditModal = true;
  }

  closeEditModal() {
    this.showEditModal = false;
    this.editingStudent = null;
  }

  openAddModel(): void {
    this.showAddModel = true;
  }

  closeAddModel(): void {
    this.showAddModel = false;
  }
  openDeleteModal(student: User) {
    this.deletingStudent = student;
    this.showDeleteModal = true;
  }
  closeDeleteModal() {
    this.showDeleteModal = false;
    this.deletingStudent = null;
  }

  saveEdit(formData: any) {
    if (!this.editingStudent) return;

    const updatedStudent = { ...this.editingStudent, ...formData };

    console.log(formData);
    console.log(updatedStudent.id);

    this.studentService.updateStudent(updatedStudent).subscribe({
      next: (res: User) => {
        const index = this.students.findIndex((s) => s.id === updatedStudent.id);
        if (index !== -1) this.students[index] = res;
        this.closeEditModal();
      },
      error: (err: any) => console.error('Fehler beim Aktualisieren:', err),
    });
  }

  loadStudents() {
    this.studentService.getStudent().subscribe({
      next: (data) => {
        console.log('API Data:', data);
        this.students = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Fehler beim Laden der Schüler', err);
        this.loading = false;
      },
    });
  }

  saveStudent(formData: any) {
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
      role: 2,
      courseId: courseIds,
    };

    this.studentService.createStudent(dto).subscribe({
      next: (student) => {
        this.students.push(student); // direkt zur Liste hinzufügen
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

  deleteStudent() {
    if (!this.deletingStudent) return;

    this.studentService.deleteStudent(this.deletingStudent).subscribe({
      next: () => {
        this.students = this.students.filter((s) => s.id !== this.deletingStudent!.id);
      },
      error: (err) => console.error('Fehler beim Löschen', err),
    });
  }

  onResetPassword(student: User) {
    if (!confirm(`Passwort für ${student.firstName} ${student.lastName} wirklich zurücksetzen?`)) {
      return;
    }

    this.studentService.resetPassword(student.id).subscribe({
      next: (res) => {
        console.log('Neues temporäres Passwort:', res.temporaryPassword);
        this.tempPassword = res.temporaryPassword;
      },
      error: (err) => {
        console.error('Fehler beim Zurücksetzen des Passworts', err);
        alert('Passwort konnte nicht zurückgesetzt werden.');
      },
    });
  }

  loadAllClasses() {
    this.studentService.getClasses().subscribe({
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
