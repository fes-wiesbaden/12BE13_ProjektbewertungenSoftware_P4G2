import { User } from '../../models/user.interface';
import { TableColumn } from './table-column';

export interface FilterOption {
  key: string;
  label: string;
}

export const userColumns: TableColumn<User>[] = [
  { key: 'firstName', label: 'Vorname' },
  { key: 'lastName', label: 'Nachname' },
  { key: 'username', label: 'Benutzername' },
  { key: 'roleName', label: 'Rolle' },
];

export const userCourseColumns: TableColumn<User>[] = [
  { key: 'firstName', label: 'First Name' },
  { key: 'lastName', label: 'Last Name' },
  { key: 'username', label: 'Username' },
  { key: 'courseName', label: 'Kursname' },
];

export const filterOptionColumn: FilterOption[] = [
  { key: 'firstName', label: 'Vorname' },
  { key: 'lastName', label: 'Nachname' },
  { key: 'username', label: 'Benutzername' },
];
