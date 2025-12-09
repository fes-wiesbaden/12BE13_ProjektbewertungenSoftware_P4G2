import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { Grade } from '../../../Interfaces/grade.interface';

@Component({
  selector: 'app-grade-viewer',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './grade-viewer.component.html'
})
export class GradeViewerComponent {
  @Input() grades: Grade[] = [];
  @Input() title: string = 'Notenübersicht';
}

