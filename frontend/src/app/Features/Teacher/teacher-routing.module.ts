import { Routes } from "@angular/router";
import { TeacherDashboard } from './teacher-dashboard/teacher-dashboard';
import { MyStudents } from './my-students/my-students';
import { MyClasses } from './my-classes/my-classes';
import { MyProfile } from './my-profile/my-profile';
import { StudentGroups } from "./student-groups/student-groups";
import { ManageGrades } from "./manage-grades/manage-grades";
import { Projects } from "./projects/projects";
import { Project } from "./project/project";
import { Group } from "./group/group";


export const TeacherRoutes: Routes = [
  {
    path: 'dashboard',
    component: TeacherDashboard,
  },
  {
    path: 'my-profile',
    component: MyProfile
  },
  {
    path: 'my-students',
    component: MyStudents
  },
  {
    path: 'my-classes',
    component: MyClasses
  },
    {
    path: 'manage-grades',
    component: ManageGrades
  },
  {
    path: 'groups',
    component: StudentGroups
  },
  {
    path: 'groups/:groupId',
    component: Group
  },
  {
    path: 'projects',
    component: Projects
  },
  {
    path: 'projects/:projectId',
    component: Project
  }
];
