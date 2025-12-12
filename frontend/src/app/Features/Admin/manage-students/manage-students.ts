import { Component, OnInit } from '@angular/core';
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
import { ImportModalComponent } from '../../../Shared/Components/import-modal/import-modal';
import { ExportModalComponent } from '../../../Shared/Components/export-modal/export-modal';
import { UserService } from '../../../Shared/Services/user.service';
import { CourseService } from '../../../Shared/Services/course.service';
import { AddUser, UpdateUser, User, UserResetPassword } from '../../../Shared/models/user.interface';
import { ResetPassword } from '../../../Shared/Components/reset-password/reset-password';
import { FilterOption, filterOptionColumn, userCourseColumns } from '../../../Shared/Components/table-column/table-columns';
import { courseAddFields, courseAddSingleOptionFields, courseEditFields, courseEditSingleOptionFields } from '../../../Shared/Components/form-modal/form-modal-fields';

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
    ImportModalComponent,
    ExportModalComponent,
    ResetPassword,
  ],
  templateUrl: './manage-students.html',
})
export class ManageStudents implements OnInit {
  students: User[] = [];
  filteredStudents: User[] = [];

  classes: { label: string; value: any }[] = [];
  loading = true;
  showImportModal = false;
  showExportModal = false;
  onImportFile(file: File) {
    console.log('Import-Datei:', file);
  }

  columns: TableColumn<User>[] = userCourseColumns;
  addFields: FormField[] = courseAddSingleOptionFields;
  editFields: FormField[] = courseEditSingleOptionFields;
  filterOptions: FilterOption[] = filterOptionColumn;

  showAddModel: boolean = false;
  showEditModal: boolean = false;
  showDeleteModal: boolean = false;
  showResetModal = false;
  tempPassword: string = '';

  editingStudent: User | null = null;
  deletingStudent: User | null = null;

  selectedFilter = this.filterOptions[0].key; 

  delete: any;

  constructor(
    private userService: UserService,
    private courseService: CourseService,
  ) {}

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

  openResetModal(password: string) {
    this.tempPassword = password;
    this.showResetModal = true;
  }

  closeResetModel() {
    this.showResetModal = false;
    this.tempPassword = '';
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

    const updatedStudent: UpdateUser = {
      id: this.editingStudent.id,
      firstName: formData.firstName,
      lastName: formData.lastName,
      username: formData.username,
      courseId: formData.courseId ? [formData.courseId] : [],
    };

    this.userService.updateUser(updatedStudent).subscribe({
      next: (res: UpdateUser) => {
        const index = this.students.findIndex((s) => s.id === updatedStudent.id);
        if (index !== -1) {
          this.students[index] = {
            ...this.students[index],
            ...res,
          };
        }
        this.closeEditModal();
      },
      error: (err: any) => console.error('Fehler beim Aktualisieren:', err),
    });
  }

  loadStudents() {
    this.userService.getUsersByRoleId(2).subscribe({
      next: (data) => {
        this.students = data;
        this.filteredStudents = [...data];
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

    this.userService.createUserByRoleId(2, dto).subscribe({
      next: (student) => {
        this.students.push(student);
        this.closeAddModel();
      },
      error: (err) => console.error('Fehler beim Erstellen:', err),
    });
  }

  deleteStudent() {
    if (!this.deletingStudent) return;

    const idToDelete = this.deletingStudent.id;
    this.userService.deleteUser(this.deletingStudent).subscribe({
      next: () => {
        this.students = this.students.filter((s) => s.id !== idToDelete);
        this.deletingStudent = null;
        this.closeDeleteModal();
      },
      error: (err) => console.error('Fehler beim Löschen', err),
    });
  }

  loadAllClasses() {
    this.courseService.getAllCourses().subscribe({
      next: (data) => {
        const formatted = data.map((c) => ({
          label: c.courseName,
          value: c.id,
        }));

        this.classes = formatted;

        const courseField = this.addFields.find((f) => f.key === 'courseId');
        if (courseField) {
          courseField.options = formatted;
        }
        const courseFieldEdit = this.editFields.find((f) => f.key === 'courseId');
        if (courseFieldEdit) {
          courseFieldEdit.options = this.classes.map((c) => ({ ...c, selected: false }));
        }

        this.loading = false;
      },
      error: (err) => {
        console.error('Fehler beim Laden der Klassen', err);
        this.loading = false;
      },
    });
  }

  onHeaderSearch(searchValue: string) {
    searchValue = searchValue.toLowerCase();
    this.filteredStudents = this.students.filter((student) => {
      const value = student[this.selectedFilter as keyof User];
      return value ? value.toString().toLowerCase().includes(searchValue) : false;
    });
  }

  onHeaderFilterChange(filterKey: string) {
    this.selectedFilter = filterKey;
    this.filteredStudents = [...this.students];
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
