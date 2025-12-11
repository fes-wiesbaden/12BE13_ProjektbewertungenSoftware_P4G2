import { FormField } from './form-modal';

export const defaultAddFields: FormField[] = [
  {
    key: 'firstName',
    label: 'Vorname',
    type: 'text',
    required: true,
    colSpan: 3,
    placeholder: 'Vorname',
  },
  {
    key: 'lastName',
    label: 'Nachname',
    type: 'text',
    required: true,
    colSpan: 3,
    placeholder: 'Nachname',
  },
  {
    key: 'username',
    label: 'Benutzername',
    type: 'text',
    required: true,
    colSpan: 3,
    placeholder: 'Benutzername',
  },
  {
    key: 'roleId',
    label: 'Rolle',
    type: 'text',
    readonly: true,
    colSpan: 3,
    value: 'Administrator',
  },
  {
    key: 'password',
    label: 'Passwort',
    type: 'password',
    required: true,
    colSpan: 3,
    placeholder: 'Passwort',
  },
  {
    key: 'confirmPassword',
    label: 'Passwort wiederholen',
    type: 'password',
    required: true,
    colSpan: 3,
    placeholder: 'Passwort wiederholen',
  },
];

export const defaultEditFields: FormField[] = [
  {
    key: 'firstName',
    label: 'Vorname',
    type: 'text',
    required: true,
    colSpan: 3,
    placeholder: 'Vorname',
  },
  {
    key: 'lastName',
    label: 'Nachname',
    type: 'text',
    required: true,
    colSpan: 3,
    placeholder: 'Nachname',
  },
  {
    key: 'username',
    label: 'Benutzername',
    type: 'text',
    required: true,
    colSpan: 3,
    placeholder: 'Benutzername',
  },
];

export const courseAddFields: FormField[] = [
  {
    key: 'firstName',
    label: 'Vorname',
    type: 'text',
    required: true,
    colSpan: 3,
    placeholder: 'Vorname',
  },
  {
    key: 'lastName',
    label: 'Nachname',
    type: 'text',
    required: true,
    colSpan: 3,
    placeholder: 'Nachname',
  },
  {
    key: 'username',
    label: 'Benutzername',
    type: 'text',
    required: true,
    colSpan: 3,
    placeholder: 'Benutzername',
  },
  {
    key: 'courseId',
    label: 'Kurs',
    type: 'multiselect',
    colSpan: 3,
    options: [],
  },
  {
    key: 'password',
    label: 'Passwort',
    type: 'password',
    required: true,
    colSpan: 3,
    placeholder: 'Passwort',
  },
  {
    key: 'confirmPassword',
    label: 'Passwort wiederholen',
    type: 'password',
    required: true,
    colSpan: 3,
    placeholder: 'Passwort wiederholen',
  },
];

export const courseEditFields: FormField[] = [
  {
    key: 'firstName',
    label: 'Vorname',
    type: 'text',
    required: true,
    colSpan: 3,
    placeholder: 'Vorname',
  },
  {
    key: 'lastName',
    label: 'Nachname',
    type: 'text',
    required: true,
    colSpan: 3,
    placeholder: 'Nachname',
  },
  {
    key: 'username',
    label: 'Benutzername',
    type: 'text',
    required: true,
    colSpan: 3,
    placeholder: 'Benutzername',
  },
  {
    key: 'courseId',
    label: 'Kurs',
    type: 'multiselect',
    colSpan: 3,
    options: [],
  },
];
