import { Component, input, computed, signal, effect } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import {IProject} from '../../../core/modals/project.modal';

@Component({
  selector: 'app-project',
  standalone: true,
  imports: [MatIcon, CommonModule],
  templateUrl: './project.html',
  styleUrls: ['./project.css'],
})
export class Project {
  projectId = input.required<string>();

  projects = signal<IProject[]>([

  ]);

  currentProject = computed(() => {
    const id = String(this.projectId());
    return this.projects().find((p) => p.id === id);
  });

  projectNotFound = computed(() => !this.currentProject());

  // Calculate days until deadline
  daysUntilDeadline = computed(() => {
    const project = this.currentProject();
    if (!project) return null;

    const today = new Date();
    const deadline = new Date(project.dueDate);
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
