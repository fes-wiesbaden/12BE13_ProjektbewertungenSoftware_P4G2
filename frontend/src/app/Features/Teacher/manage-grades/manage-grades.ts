import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';

interface Student {
  id: number;
  name: string;
  email: string;
  avatarUrl: string;
  subject: string;
  grade: string;
}

@Component({
  selector: 'app-my-classes',
  standalone: true,
  imports: [CommonModule, FormsModule, MatIconModule],
  templateUrl: './manage-grades.html'
})
export class ManageGrades {
  quickEditEnabled = false;

  students: Student[] = [
    {
      id: 1,
      name: 'Mahdi Haidary',
      email: 'mahdi.haidary@sinc.de',
      avatarUrl: 'https://flowbite.com/docs/images/people/profile-picture-5.jpg',
      subject: 'Mathematik',
      grade: '2+'
    },
    {
      id: 2,
      name: 'Max Mustermann',
      email: 'max.mustermann@sinc.de',
      avatarUrl: 'https://flowbite.com/docs/images/people/profile-picture-3.jpg',
      subject: 'Deutsch',
      grade: '1-'
    },
    {
      id: 3,
      name: 'Anna Müller',
      email: 'anna.mueller@sinc.de',
      avatarUrl: 'https://flowbite.com/docs/images/people/profile-picture-2.jpg',
      subject: 'Englisch',
      grade: '3'
    }
  ];

  selectedStudent: Student | null = null;  
  modalData: Student | null = null;         

  toggleQuickEdit(): void {
    this.quickEditEnabled = !this.quickEditEnabled;
  }

  openModal(student: Student): void {
    this.selectedStudent = student;
    this.modalData = { ...student }; 
  }

  closeModal(): void {
    this.selectedStudent = null;
    this.modalData = null;
  }

  saveFromModal(): void {
    if (!this.selectedStudent || !this.modalData) return;

    Object.assign(this.selectedStudent, this.modalData);
    this.closeModal();
  }

  saveAllQuickEdit(): void {
    console.log('Aktuelle Schülerdaten:', this.students);
  }

  trackByStudentId(index: number, student: Student): number {
    return student.id;
  }
}
