

export interface Group {
  id: string;
  name: string;
  projectId: string;
}

export interface CreateGroupDto {
  name: string;
  projectId: string;
}

export interface UpdateGroupDto {
  name?: string;
}

export interface AddMemberToGroupDto {
  userId: string;
  groupId: string;
  role?: string;
}

export interface UserProjectGroupResponse {
  id: string;
  userId: string;
  userName: string;
  projectId: string;
  projectName: string;
  groupId: string;
  groupName: string;
  role: string;
}
