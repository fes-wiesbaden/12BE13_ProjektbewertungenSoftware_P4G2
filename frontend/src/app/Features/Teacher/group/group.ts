import { Component, input, computed } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { DatePipe, TitleCasePipe, NgClass, CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

interface IMember {
  id: number;
  name: string;
  username?: string;
}


interface IGroup {
  id: number;
  name: string;
  description?: string;
  projectId: number;
  projectName: string;
  members: IMember[];
  createdDate: Date;
  deadline: Date;
}

@Component({
  selector: 'app-group',
  standalone: true,
  imports: [MatIcon, DatePipe, TitleCasePipe, NgClass, CommonModule, RouterLink],
  templateUrl: './group.html',
  styleUrls: ['./group.css']
})
export class Group {
  groupId = input.required<string>();

  groups: IGroup[] = [
    {
      id: 1,
      name: 'Group 1',
      description: '',
      projectId: 1,
      projectName: 'Project 1',
      createdDate: new Date('2024-01-15'),
      deadline: new Date('2024-06-30'),
      members: [
        { id: 1, name: 'Alice Johnson', username: 'alice@example.com' },
        { id: 2, name: 'Bob Smith', username: 'bob@example.com' },
        { id: 3, name: 'Carol White', username: 'carol@example.com' }
      ],
    },
    {
      id: 2,
      name: 'Group 2',
      description: '',
      projectId: 1,
      projectName: 'Project 1',
      createdDate: new Date('2024-01-15'),
      deadline: new Date('2024-05-30'),
      members: [
        { id: 4, name: 'David Brown', username: 'david@example.com' },
        { id: 5, name: 'Eve Davis',  username: 'eve@example.com' }
      ],

    },
    {
      id: 3,
      name: 'Group 3',
      description: '',
      projectId: 2,
      projectName: 'Project 2',
      createdDate: new Date('2024-02-01'),
      deadline: new Date('2024-07-15'),
      members: [
        { id: 6, name: 'Frank Miller',  username: 'frank@example.com' },
        { id: 7, name: 'Grace Lee',  username: 'grace@example.com' },
        { id: 8, name: 'Henry Wilson',  username: 'henry@example.com' }
      ],
    }
  ];

  currentGroup = computed(() => {
    const id = Number(this.groupId());
    return this.groups.find(g => g.id === id);
  });


  daysUntilDeadline = computed(() => {
    const group = this.currentGroup();
    if (!group) return 0;
    
    const today = new Date();
    const deadline = new Date(group.deadline);
    const diffTime = deadline.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return diffDays;
  });

  isOverdue = computed(() => this.daysUntilDeadline() < 0);
  isDeadlineApproaching = computed(() => this.daysUntilDeadline() >= 0 && this.daysUntilDeadline() <= 7);

  getDeadlineText(days: number): string {
    if (days < 0) {
      return `${Math.abs(days)} day${Math.abs(days) !== 1 ? 's' : ''} overdue`;
    } else if (days === 0) {
      return 'Due today';
    } else if (days === 1) {
      return 'Due tomorrow';
    } else {
      return `${days} days remaining`;
    }
  }


  getTaskStatusColor(status: string): string {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100';
      case 'in-progress':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100';
      case 'todo':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-600 dark:text-gray-100';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-600 dark:text-gray-100';
    }
  }

  editGroup() {
    console.log('Edit group', this.groupId());
  }

  addMember() {
    console.log('Add member to group', this.groupId());
  }

  addTask() {
    console.log('Add task to group', this.groupId());
  }
}