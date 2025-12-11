import { Routes } from '@angular/router';
import { StudentDashboard } from './student-dashboard/student-dashboard';
import { MyProfile } from './my-profile/my-profile';
import { MyAssessment } from './my-assessment/my-assessment';
import { MyClasses } from './my-classes/my-classes';
import { MyGrades } from './my-grades/my-grades';

export const StudentRoutes: Routes = [
  {
    path: 'dashboard',
    component: StudentDashboard,
  },
  {
    //noten
    path: 'my-profile',
    component: MyGrades,
  },
  {
    //selbstfremd
    path: 'my-assessment',
    component: MyAssessment,
  },
  {
    //Gruppen
    path: 'my-classes',
    component: MyClasses,
  },
];
