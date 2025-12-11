export interface User {
  id: string;
  firstName: string;
  lastName: string;
  username: string;
  roleName: string;
  courseId?: string[];
}

export interface AddUser {
  firstName: string;
  lastName: string;
  username: string;
  password: string;
  role: number;
  courseId: String[];
}

export interface UpdateUser {
  id: string;
  firstName: string;
  lastName: string;
  username: string;
  courseId?: string[];
}

export interface UserResetPassword {
  newPassword: string;
}

export interface UserChangePassword {
  oldPassword: string;
  newPassword: string;
}
