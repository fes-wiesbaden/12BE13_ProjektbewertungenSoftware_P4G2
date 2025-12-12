import {Component, OnInit} from '@angular/core';
import {Router, RouterLink} from '@angular/router';
import { MatIcon } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {IProject, ProjectCreateRequestDto, ProjectStatus} from '../../../core/modals/project.modal';
import {ProjectService} from '../../../core/services/project.service';
import {ProjectMapperService} from '../../../core/services/project.mapper.service';
import {AuthService} from '../../../core/auth/auth.service';

@Component({
  selector: 'app-projects-list',
  imports: [MatIcon, CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './projects.html',
  styleUrls: ['./projects.css'],
  standalone: true
})
export class Projects implements OnInit {
  showNewModel = false;
  projects: IProject[] = [];
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

  ngOnInit(): void {
    this.loadProjects();
  }



  loadProjects(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.projectService.getAllProjects().subscribe({
      next: (projects: IProject[]) => {
        this.projects = projects;
        this.isLoading = false;
        console.log('Loaded projects:', projects);
      },
      error: (error) => {
        console.error('Error fetching projects:', error);
        this.errorMessage = 'Failed to load projects. Please try again.';
        this.isLoading = false;
      }
    });
  }

  getStatusLabel(status?: IProject['status']): string {
    return this.mapper.getStatusLabel(status);
  }

  viewProjectDetails(projectId: string): void {
    console.log('Navigating to project:', projectId);
    this.router.navigate(['/projects', projectId]); // ✅ Fixed navigation path
  }

  deleteProject(projectId: number, event: Event): void {
    event.stopPropagation();
    if (confirm('Are you sure you want to delete this project?')) {
      // Implement delete logic here
      console.log('Deleting project:', projectId);
    }
  }

  openNewModel(): void {
    this.showNewModel = true;
    this.projectForm.reset();
  }

  closeNewModel(): void {
    this.showNewModel = false;
    this.projectForm.reset();
  }
  initForm(): void {
    this.projectForm = this.fb.group({
      projectName: ['', [Validators.required, Validators.minLength(3)]],
      startDate: ['', Validators.required],
      dueDate: ['', Validators.required],
      description: ['']
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
        this.loadProjects(); // Refresh the list
      },
      error: (error) => {
        console.error('Error creating project:', error);
        this.errorMessage = 'Failed to create project. Please try again.';
        this.isSubmitting = false;
      }
    });
  }

// ✅ Add this helper method to your component
  private toLocalDateTime(date: Date): string {
    return date.toISOString().slice(0, -1); // Removes the 'Z'
  }

  editProject(id: number): void {
    console.log('Edit project', id);
    this.router.navigate(['/projects', id, 'edit']);
  }
}
