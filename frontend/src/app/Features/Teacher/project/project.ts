import {Component, input, computed, signal, effect, OnInit} from '@angular/core';
import { MatIconModule } from "@angular/material/icon";
import { CommonModule } from '@angular/common';
import {Router, RouterLink} from '@angular/router';
import {ProjectService} from '../../../core/services/project.service';
import { Group } from '../../../models/group.model';
import { IProject } from '../../../models/project.model';


@Component({
  selector: 'app-project',
  standalone: true,
  imports: [MatIconModule, CommonModule],
  templateUrl: './project.html',
  styleUrls: ['./project.css']
})
export class Project implements OnInit {
  // Input signal for project ID
  projectId = input.required<string>();

  // Current project signal
  currentProject = signal<IProject | null>(null);
  // // Groups for current project
  projectGroups = signal<Group[]>([]);


  constructor(private projectService: ProjectService, private router: Router) {
      effect(() => {
        const id = this.projectId();
        if (id) {
          this.loadProject(id);
          this.loadProjectGroup(id);
        }
      });
    }

    ngOnInit(): void {
          const id = this.projectId();
          if (id) {
            this.loadProject(id);
            this.loadProjectGroup(id);
          }
      }

  loadProject(projectId: string): void{
        this.projectService.getProjectById(this.projectId()).subscribe({
          next: (project) => {
            this.currentProject.set(project);
            console.log('Project loaded', project);
          },
          error: (error) => {
            console.error('Error loading project: ', error);
          }
        })
      }

  loadProjectGroup(id: string): void {
      this.projectService.getProjectGroups(id).subscribe({
        next: (groups) => {
          this.projectGroups.set(groups);
          console.log('Project Groups loaded', groups);
        },
        error: (error) => {
          console.error('Error loading projectGroups: ', error);
        }
      })
      }

  // // Error handling
  // error = signal<string | null>(null);
  //
  // // Loading state
  // loading = signal<boolean>(false);
  //

  //

  //
  // // Computed: Check if project is loaded
  // projectLoaded = computed(() => this.currentProject() !== null);
  //
  // // Computed: Check if project not found
  // projectNotFound = computed(() => !this.loading() && !this.currentProject());
  //
  // // Computed: Total number of groups
  // totalGroups = computed(() => this.projectGroups().length);
  //
  //
  // // Calculate days until deadline
  // daysUntilDeadline = computed(() => {
  //   const project = this.currentProject();
  //   if (!project) return null;
  //
  //   const today = new Date();
  //   const deadline = new Date(project.deadline);
  //   const diffTime = deadline.getTime() - today.getTime();
  //   const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  //
  //   return diffDays;
  // });
  //
  // // Check if deadline is approaching (within 7 days)
  // isDeadlineApproaching = computed(() => {
  //   const days = this.daysUntilDeadline();
  //   return days !== null && days > 0 && days <= 7;
  // });
  //
  // // Check if overdue
  // isOverdue = computed(() => {
  //   const days = this.daysUntilDeadline();
  //   return days !== null && days < 0;
  // });
  //
  // // Total number of team members
  // totalMembers = computed(() => {
  //   const project = this.currentProject();
  //   if (!project) return 0;
  //   return project.groups.reduce((sum, group) => sum + group.members.length, 0);
  // });
  //
  //
  //
  //
  //
  //
  //
  //   refreshProject(): void {
  //     const id = this.projectId();
  //     if (id) {
  //       this.loadProject(id);
  //       this.loadProjectGroup(id);
  //     }
  //   }
  //
  //
  //
  //
  // getDeadlineText(days: number | null): string {
  //   if (days === null) return '';
  //   if (days < 0) return `${Math.abs(days)} days overdue`;
  //   if (days === 0) return 'Due today';
  //   if (days === 1) return 'Due tomorrow';
  //   return `${days} days remaining`;
  // }
  //
  // getDeadlineStatusClass(): string {
  //   if (this.isOverdue()) return 'status-overdue';
  //   if (this.isDeadlineApproaching()) return 'status-approaching';
  //   return 'status-normal';
  // }
  //
  // goToGroup(groupId: string): void {
  //   this.router.navigate(['/groups', groupId]);
  // }
  //
  // goBack(): void {
  //   this.router.navigate(['/projects']);
  // }
  //
  //
  // editProject(): void {
  //   const id = this.projectId();
  //   if (id) {
  //     this.router.navigate(['/projects', id, 'edit']);
  //   }
  // }
  //
  //
  // deleteProject(): void {
  //   const id = this.projectId();
  //   if (!id) return;
  //
  //   const project = this.currentProject();
  //   const confirmMessage = `Are you sure you want to delete ${project}? This action cannot be undone.`;
  //
  //   if (confirm(confirmMessage)) {
  //     this.loading.set(true);
  //
  //     this.projectService.deleteProject(id).subscribe({
  //       next: () => {
  //         console.log('Project deleted');
  //         this.router.navigate(['/projects']);
  //       },
  //       error: (error) => {
  //         this.error = error.message || 'Failed to delete project';
  //         this.loading.set(false);
  //         console.error('Error deleting project deleted: ', error);
  //       }
  //     });
  //   }
  // }
  //
  // createGroup(): void {
  //   const id = this.projectId();
  //   if (!id) return;
  //
  //   // Navigate to create group page with project ID
  //   this.router.navigate(['/groups', 'create'], {
  //     queryParams: { projectId: id }
  //   });
  // }
  //
  // addGroup(): void {
  //   const id = this.projectId();
  //   if (id) {
  //     this.router.navigate(['/projects', id, 'add-group']);
  //   }
  // }
  //
  // getStatusClass(status: string): string {
  //   switch (status?.toLowerCase()) {
  //     case 'active':
  //       return 'badge-active';
  //     case 'completed':
  //       return 'badge-completed';
  //     case 'pending':
  //       return 'badge-pending';
  //     case 'overdue':
  //       return 'badge-overdue';
  //     default:
  //       return 'badge-default';
  //   }
  // }

}
