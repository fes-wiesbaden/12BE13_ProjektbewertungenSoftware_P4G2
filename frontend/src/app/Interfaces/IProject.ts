import {IGroup} from './IGroup';
import {Group} from './group.interface';

export interface IProject {
  id: number;
  title: string;
  description?: string;
  status?: 'active' | 'completed' | 'pending' | 'overdue';
  deadline: Date;
  groups: Group[];
  createdAt?: Date;
}
