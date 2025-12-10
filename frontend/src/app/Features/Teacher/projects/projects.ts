import { Component, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatIcon } from '@angular/material/icon';
import { IProject } from '../project/project';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-projects-list',
  imports: [MatIcon, RouterLink, CommonModule],
  templateUrl: './projects.html',
  styleUrls: ['./projects.css']
})
export class Projects {
  showNewModel = false;


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