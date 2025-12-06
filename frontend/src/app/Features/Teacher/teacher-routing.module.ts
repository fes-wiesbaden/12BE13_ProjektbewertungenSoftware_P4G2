import { Routes } from '@angular/router';
import { TeacherDashboard } from './teacher-dashboard/teacher-dashboard';
import { MyStudents } from './my-students/my-students';
import { MyProfile } from './my-profile/my-profile';
import { StudentGroups } from './student-groups/student-groups';
import { Projects } from './projects/projects';
import { Project } from './project/project';
import { Group } from './group/group';
import { ManageLearningField } from './manage-learning-field/manage-learning-field';

export const TeacherRoutes: Routes = [
  {
    path: 'dashboard',
    component: TeacherDashboard,
  },
  {
    path: 'my-profile',
    component: MyProfile,
  },
  {
    path: 'my-students/:classId',
    component: MyStudents,
  },
  {
    path: 'manage-learning-fields/:studentId',
    component: ManageLearningField,
  },
  {
    path: 'groups',
    component: StudentGroups,
  },
  {
    path: 'groups/:groupId',
    component: Group,
  },
  {
    path: 'projects',
    component: Projects,
  },
  {
    path: 'projects/:projectId',
    component: Project,
  },
];
