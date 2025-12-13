import {Component, input, computed, signal, OnInit} from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import {IProject, ProjectCreateRequestDto, ProjectStatus} from '../../../core/modals/project.modal';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {ProjectService} from '../../../core/services/project.service';
import {ProjectMapperService} from '../../../core/services/project.mapper.service';

@Component({
  selector: 'app-project',
  standalone: true,
  imports: [MatIcon, CommonModule, ReactiveFormsModule],
  templateUrl: './project.html',
  styleUrls: ['./project.css'],
})
export class Project implements OnInit {
  projectId = input.required<string>();
  project = signal<IProject | undefined>(undefined);
  showNewModel = false;
  isLoading = false;
  errorMessage = '';
  projectForm!: FormGroup;
  isSubmitting = false;

  constructor(
    private router: Router,
    private projectService: ProjectService,
    private mapper: ProjectMapperService,
    private fb: FormBuilder,
  ) {
    this.initForm();
  }

  initForm(): void {
    this.projectForm = this.fb.group({
      projectName: ['', [Validators.required, Validators.minLength(3)]],
      startDate: ['', Validators.required],
      dueDate: ['', Validators.required],
      description: ['']
    });
  }

  ngOnInit(): void {
    this.loadProject();
  }

  loadProject(): void {
    this.isLoading = true;
    this.errorMessage = '';
    const id = String(this.projectId());

    this.projectService.getProjectWithGroupsById(id).subscribe({
      next: (project: IProject) => {
        this.project.set(project); //
        this.isLoading = false;
        console.log('Loaded project:', project);
      },
      error: (error) => {
        console.error('Error fetching project:', error);
        this.errorMessage = 'Failed to load project. Please try again.';
        this.isLoading = false;
      }
    });
  }

  onSubmit(): void {
    if (this.projectForm.invalid) {
      this.projectForm.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;
    const formValue = this.projectForm.value;

    const newProject: ProjectCreateRequestDto = {
      projectName: formValue.projectName,
      projectDescription: formValue.description || '',
      startDate: this.mapper.serializeDate(new Date(formValue.startDate)),
      dueDate: this.mapper.serializeDate(new Date(formValue.dueDate)),
      ProjectStatus: ProjectStatus.PENDING
    };

    this.projectService.createProject(newProject).subscribe({
      next: (createdProject) => {
        console.log('Project created successfully:', createdProject);
        this.isSubmitting = false;
        this.closeNewModel();
        this.loadProject();
      },
      error: (error) => {
        console.error('Error creating project:', error);
        this.errorMessage = 'Failed to create project. Please try again.';
        this.isSubmitting = false;
      }
    });
  }

  closeNewModel(): void {
    this.showNewModel = false;
    this.projectForm.reset();
    this.errorMessage = '';
  }

  openNewModel(): void {
    this.showNewModel = true;
  }

  // ✅ Computed signal for current project
  currentProject = computed(() => this.project());

  // ✅ Computed signal for total members
  totalMembers = computed(() => {
    const proj = this.project();
    if (!proj || !proj.groups) return 0;
    return proj.groups.reduce((total, group) => total + (group.members?.length || 0), 0);
  });

  projectNotFound = computed(() => !this.project());

  // Calculate days until deadline
  daysUntilDeadline = computed(() => {
    const project = this.project();
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

  getDeadlineText(days: number | null): string {
    if (days === null) return '';
    if (days < 0) return `${Math.abs(days)} days overdue`;
    if (days === 0) return 'Due today';
    if (days === 1) return 'Due tomorrow';
    return `${days} days remaining`;
  }
}
