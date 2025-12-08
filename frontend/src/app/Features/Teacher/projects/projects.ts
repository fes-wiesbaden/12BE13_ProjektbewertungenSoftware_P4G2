import {Component, OnInit, signal} from '@angular/core';
import {Router, RouterLink} from '@angular/router';
import { MatIcon } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import {Group} from '../group/group';
import {ProjectService} from '../../../core/services/project.service';
import {GroupService} from '../../../core/services/group.service';
import {CreateProjectDto, IProject} from '../../../models/project.model';
import {forkJoin} from 'rxjs';
import {Project} from '../project/project';


@Component({
  selector: 'app-projects-list',
  imports: [MatIcon, RouterLink, CommonModule],
  templateUrl: './projects.html',
  styleUrls: ['./projects.css']
})
export class Projects implements OnInit {
  showNewModel = false;
  //
  projects = signal<IProject[]>([]);
  loading = signal<boolean>(false);
  error = signal<string | null>(null);


  constructor(private projectService: ProjectService, private groupService: GroupService, private router: Router) {
  }
  ngOnInit(): void {
  this.loadAllProjects();
  }

  // loadProjects(): void {
  //   this.projectService.getAllProjects().subscribe({
  //     next: (projects) => {
  //       this.projects = projects;
  //       console.log(this.projects);
  //     },
  //     error: (error) => {
  //       console.error('Error loading project: ', error);
  //     }
  //   });
  // }


  loadAllProjects(): void {
    this.loading.set(true);
    this.error.set(null);

    // First, get all projects
    this.projectService.getAllProjects().subscribe({
      next: (projects) => {
        console.log('Projects loaded:', projects);

        // Then, load groups for each project
        const groupRequests = projects.map(project =>
          this.projectService.getProjectGroups(project.id)
        );

        // Wait for all group requests to complete
        forkJoin(groupRequests).subscribe({
          next: (groupsArrays) => {
            // Merge groups into projects
            const projectsWithGroups = projects.map((project, index) => ({
              ...project,
              groups: groupsArrays[index]
            }));

            this.projects.set(projectsWithGroups);
            console.log(projectsWithGroups);
            this.loading.set(false);
            console.log('Projects with groups:', projectsWithGroups);
          },
          error: (error) => {
            console.error('Error loading groups:', error);
            // Still show projects even if groups fail to load
            this.projects.set(projects);
            this.loading.set(false);
          }
        });
      },
      error: (error) => {
        this.error.set(error.message || 'Failed to load projects');
        this.loading.set(false);
        console.error('Error loading projects:', error);
      }
    });
  }



  // createProject(name: string, description: string): void {
  //   const newProject: CreateProjectDto = {
  //     name: name,
  //     description: description
  //   };
  //
  //   this.projectService.createProject(newProject).subscribe({
  //     next: (project) => {
  //       console.log('Project created:', project);
  //       this.projects.push(project);
  //       this.error = null;
  //     },
  //     error: (error) => {
  //       this.error = error.message;
  //     }
  //   });
  // }



  // projects = signal<IProject[]>([
  //   {
  //     id: 1,
  //     title: "Project 1",
  //     description: "Einrichtung eines IT-geschützten Arbeitsplatzes I",
  //     status: 'completed',
  //     deadline: new Date('2023-03-15'),
  //     groups: [
  //       { id: 1, name: "Group 1", members: ["Alice", "Bob", "Charlie"] },
  //       { id: 2, name: "Group 2", members: ["Alice", "Bob", "Charlie"] },
  //       { id: 3, name: "Group 3", members: ["Alice", "Bob", "Charlie"] },
  //       { id: 4, name: "Group 4", members: ["Alice", "Bob", "Charlie"] },
  //       { id: 5, name: "Group 5", members: ["Alice", "Bob", "Charlie"] },
  //     ]
  //   }
  // ]);
  openNewModel() {
    this.showNewModel = true;
  }

  closeNewModel() {
    this.showNewModel = false;
  }

  editProject(id: number) {
    console.log('Edit project', id);
    // Handle edit logic
  }
}
