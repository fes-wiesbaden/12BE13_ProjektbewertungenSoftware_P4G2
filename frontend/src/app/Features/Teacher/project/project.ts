import { Component, input, computed, signal, effect } from '@angular/core';
import { MatIcon } from "@angular/material/icon";
import { CommonModule } from '@angular/common';

export interface IGroup {
  id: number;
  name: string;
  members: string[];
}

export interface IProject {
  id: number;
  title: string;
  description?: string;
  status?: 'active' | 'completed' | 'pending' | 'overdue';
  deadline: Date;
  groups: IGroup[];
  createdAt?: Date;
}

@Component({
  selector: 'app-project',
  standalone: true,
  imports: [MatIcon, CommonModule],
  templateUrl: './project.html',
  styleUrls: ['./project.css']
})
export class Project {
  projectId = input.required<string>();
  
 projects = signal<IProject[]>([
    { 
      id: 1, 
      title: "Project 1", 
      description: "Einrichtung eines IT-geschützten Arbeitsplatzes I",
      status: 'completed',
      deadline: new Date('2023-03-15'),
      groups: [
        { id: 1, name: "Group 1", members: ["Alice", "Bob", "Charlie"] },
        { id: 2, name: "Group 2", members: ["Alice", "Bob", "Charlie"] },
        { id: 3, name: "Group 3", members: ["Alice", "Bob", "Charlie"] },
        { id: 4, name: "Group 4", members: ["Alice", "Bob", "Charlie"] },
        { id: 5, name: "Group 5", members: ["Alice", "Bob", "Charlie"] },
      ]
    },
    { 
      id: 2, 
      title: "Project 2", 
      description: "Einrichtung eines IT-geschützten Arbeitsplatzes II",
      status: 'completed',
      deadline: new Date('2024-04-20'),
      groups: [
        { id: 1, name: "Group 1", members: ["Alice", "Bob", "Charlie"] },
        { id: 2, name: "Group 2", members: ["Alice", "Bob", "Charlie"] },
        { id: 3, name: "Group 3", members: ["Alice", "Bob", "Charlie"] },
        { id: 4, name: "Group 4", members: ["Alice", "Bob", "Charlie"] },
        { id: 5, name: "Group 5", members: ["Alice", "Bob", "Charlie"] },
      ]
    },
    { 
      id: 3, 
      title: "Project 3", 
      description: "IOT",
      status: 'completed',
      deadline: new Date('2024-01-10'),
      groups: [
        { id: 1, name: "Group 1", members: ["Alice", "Bob", "Charlie"] },
        { id: 2, name: "Group 2", members: ["Alice", "Bob", "Charlie"] },
        { id: 3, name: "Group 3", members: ["Alice", "Bob", "Charlie"] },
        { id: 4, name: "Group 4", members: ["Alice", "Bob", "Charlie"] },
        { id: 5, name: "Group 5", members: ["Alice", "Bob", "Charlie"] },      ]
    },
    { 
      id: 4, 
      title: "Project 4", 
      description: "Projektbewertung Software",
      status: 'pending',
      deadline: new Date('2025-12-17'),
      groups: [
        { id: 1, name: "Group 1", members: ["Alice", "Bob", "Charlie"] },
        { id: 2, name: "Group 2", members: ["Alice", "Bob", "Charlie"] },
        { id: 3, name: "Group 3", members: ["Alice", "Bob", "Charlie"] },
        { id: 4, name: "Group 4", members: ["Alice", "Bob", "Charlie"] },
        { id: 5, name: "Group 5", members: ["Alice", "Bob", "Charlie"] },
      ]
    }
  ]);

  currentProject = computed(() => {
    const id = Number(this.projectId());
    return this.projects().find(p => p.id === id);
  });

  projectNotFound = computed(() => !this.currentProject());

  // Calculate days until deadline
  daysUntilDeadline = computed(() => {
    const project = this.currentProject();
    if (!project) return null;
    
    const today = new Date();
    const deadline = new Date(project.deadline);
    const diffTime = deadline.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return diffDays;
  });

  // Check if deadline is approaching (within 7 days)
  isDeadlineApproaching = computed(() => {
    const days = this.daysUntilDeadline();
    return days !== null && days > 0 && days <= 7;
  });

  // Check if overdue
  isOverdue = computed(() => {
    const days = this.daysUntilDeadline();
    return days !== null && days < 0;
  });

  // Total number of team members
  totalMembers = computed(() => {
    const project = this.currentProject();
    if (!project) return 0;
    return project.groups.reduce((sum, group) => sum + group.members.length, 0);
  });

  constructor() {
    effect(() => {
      const project = this.currentProject();
      if (!project) {
        console.warn(`Project with id ${this.projectId()} not found`);
      }
    });
  }

  getDeadlineText(days: number | null): string {
    if (days === null) return '';
    if (days < 0) return `${Math.abs(days)} days overdue`;
    if (days === 0) return 'Due today';
    if (days === 1) return 'Due tomorrow';
    return `${days} days remaining`;
  }
}