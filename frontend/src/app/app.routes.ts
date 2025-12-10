// app.routes.ts
import { Routes } from '@angular/router';
import { MainLayout } from './layout/main-layout/main-layout';
import { AuthLayout } from './layout/auth-layout/auth-layout';
import { AuthGuard } from './core/auth/auth.guard';
import { AdminGuard } from './core/guards/admin.guard';
import { TeacherGuard } from './core/guards/teacher.guard';
import { StudentGuard } from './core/guards/student.guard';
import { LoginGuard } from './core/guards/login.guard';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'auth/login',
  },

  {
    path: 'login',
    pathMatch: 'full',
    redirectTo: 'auth/login',
  },

  {
    path: '',
    component: AuthLayout,
    children: [
      {
        path: 'auth',
        loadChildren: () => import('./Features/Auth/auth-routing.module').then((c) => c.AuthRoutes),
        canMatch: [LoginGuard],
      },
    ],
  },

  {
    path: '',
    component: MainLayout,
    canMatch: [AuthGuard],
    children: [
      {
        path: 'admin',
        loadChildren: () =>
          import('./Features/Admin/admin-routing.module').then((c) => c.AdminRoutes),
        canMatch: [AdminGuard],
      },
      {
        path: 'teacher',
        loadChildren: () =>
          import('./Features/Teacher/teacher-routing.module').then((c) => c.TeacherRoutes),
        canMatch: [TeacherGuard],
      },
      {
        path: 'student',
        loadChildren: () =>
          import('./Features/Student/student-routing.module').then((c) => c.StudentRoutes),
        canMatch: [StudentGuard],
      },
    ],
  },

  {
    path: '**',
    redirectTo: 'auth/login',
  },
];
