export interface StudentList{
  id: string;
  fullName: string;
  username: string;
  courseId: string[] | undefined;
}


export interface UserResponseDto {
  id: string;
  firstName: string;
  lastName: string;
  username: string;
  date: string;
  roleName: string;
  courseId: string[];       // false entity in server should be fixed later
  courseNames: string[];    // false entity in server should be fixed later
}

export interface GroupAddMemberResponseDto {
  id: string;
  memberId: string;
  memberUsername: string;
  memberFullName: string;
  roleId: number;
  groupId: string;
  groupName: string;
  joinedDate: string;
}

export interface GroupAddMemberRequestDto {
  memberId: string;
  groupId: string;
}

export interface GroupAddMembersRequestDto {
  memberId: string[];
  groupId: string;
}
