import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { TranslationService } from '../../../core/services/translation.service';

@Component({
  selector: 'app-student-dashboard',
  imports: [MatIconModule],
  templateUrl: './student-dashboard.html',
  styleUrl: './student-dashboard.css',
})
export class StudentDashboard {


  constructor(
      public i18n: TranslationService
    ) {}
}
