
export interface GroupCreateRequestDto {
  groupName: string;
  projectId: string;
}

export interface GroupResponseDto {
  id: string;
  groupName: string;
  projectId: string;
  projectName: string;
  createdAt: Date;
}

export interface IGroup {
  id: string;
  name: string;
  projectName: string;
  members: MemberSummaryDto[];
}


export interface GroupWithMembersResponseDto {
  id: string;
  name: string;
  projectId: string;
  projectName: string;
  members: MemberSummaryDto[];
  memberCount: number;
}

export interface MemberSummaryDto {
  id: string;
  userName: string;
  fullName: string;
  roleId: string;
}
