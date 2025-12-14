import { User } from '../../models/user.interface';
import { TableColumn } from './table-column';

export interface FilterOption {
  key: string;
  label: string;
}

export const userColumns: TableColumn<User>[] = [
  { key: 'firstName', label: 'table.firstname' },
  { key: 'lastName', label: 'table.lastname' },
  { key: 'username', label: 'table.username' },
  { key: 'roleName', label: 'table.role' },
];

export const userCourseColumns: TableColumn<User>[] = [
  { key: 'firstName', label: 'table.firstname' },
  { key: 'lastName', label: 'table.lastname' },
  { key: 'username', label: 'table.username' },
  { key: 'courseName', label: 'table.course' },
];

export const filterOptionColumn: FilterOption[] = [
  { key: 'firstName', label: 'table.firstname' },
  { key: 'lastName', label: 'table.lastname' },
  { key: 'username', label: 'table.username' },
];
