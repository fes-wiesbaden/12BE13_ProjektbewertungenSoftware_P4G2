import { Component, OnInit } from '@angular/core';
import { MatIconModule } from "@angular/material/icon";
import { RouterLink } from '@angular/router';

export interface Student {
  id: number,
  name: string,
  avatar: string,
  role: string,

}

@Component({
  selector: 'app-my-students',
  imports: [MatIconModule, RouterLink],
  templateUrl: './my-students.html'
})
export class MyStudents implements OnInit {
    students: Student[] = [];

    selectedStudent: Student | null = null;


    // toggles
    showEditModel: boolean = false;
    showAddModel: boolean = false;
    showDeleteModel: boolean = false;
    ngOnInit(): void {
    this.loadStudents();
  }
  loadStudents() {
    this.students = [
      {
        id: 1,
        name: 'John Doe',
        avatar: 'https://flowbite.com/docs/images/people/profile-picture-5.jpg',
        role: 'Student'
      },
      {
        id: 2,
        name: 'Jack Miller',
        avatar: 'https://flowbite.com/docs/images/people/profile-picture-5.jpg',
        role: 'Student'
      },
      {
        id: 3,
        name: 'Jamie Jons',
        avatar: 'https://flowbite.com/docs/images/people/profile-picture-5.jpg',
        role: 'Student'
      },
    ];
  }


  openEditModel(student: Student): void {
    this.selectedStudent = student;
    this.showEditModel = true;
  }

  closeEditModel(): void {
    this.showEditModel = false;
  }

  openAddModel(): void {
    this.showAddModel = true;
  }

  closeAddModel(): void {
    this.showAddModel = false;
  }
  
  openDeleteModel(): void {
    this.showDeleteModel = true;
  }

  closeDeleteModel(): void {
    this.showDeleteModel = false;
  }
}
