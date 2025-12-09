export interface User {
  id: string;
  firstName: string;
  lastName: string;
  username: string;
  roleName: string;
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
}

export interface UserResetPassword {
  newPassword: string;
}
