import { User } from "../../models/user.interface";
import { TableColumn } from "./table-column";

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

