import { Component, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute } from '@angular/router';

export interface Student {
  id: number;
  name: string;
  avatar: string;
  role: string;
}

@Component({
  selector: 'app-my-students',
  imports: [MatIconModule],
  templateUrl: './my-students.html',
})
export class MyStudents implements OnInit {
  classId!: string;

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.classId = String(this.route.snapshot.paramMap.get('classId'));

    // Jetzt kannst du die Schüler für diese Klasse laden
    // z.B. this.loadStudents(this.classId)
    console.log('Klassen-ID:', this.classId);
  }
}
