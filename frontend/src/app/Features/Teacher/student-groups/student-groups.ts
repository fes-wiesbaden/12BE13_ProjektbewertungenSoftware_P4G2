import { Component, OnInit } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import {Router, RouterLink} from '@angular/router';
import {FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {GroupService} from '../../../core/services/group.service';
import {GroupMapperService} from '../../../core/services/group.mapper.service';
import {GroupCreateRequestDto, IGroup} from '../../../core/modals/group.modal';
import {IProject, ProjectNamesResponseDto} from '../../../core/modals/project.modal';
import {ProjectService} from '../../../core/services/project.service';

@Component({
  selector: 'app-student-groups',
  imports: [MatIcon, RouterLink, ReactiveFormsModule],
  templateUrl: './student-groups.html',
  styleUrl: './student-groups.css',
})
export class StudentGroups implements OnInit {
  showAddGroupModal: boolean = false;
  groups: IGroup[] = [];
  isLoading = false;
  errorMessage= '';
  groupForm!: FormGroup;
  isSubmitting = false;

  projectNames : ProjectNamesResponseDto[] = [];

  constructor(private router : Router ,
              private fb: FormBuilder,
              private groupService: GroupService,
              private mapper: GroupMapperService,
              private projectService: ProjectService,) {
    this.initForm();
  }

  ngOnInit(): void {
    this.loadGroups();
    this.loadProjectNames();
  }

  loadGroups(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.groupService.getAllGroupsWithMembers().subscribe({
      next: (groups: IGroup[]) => {
        this.groups = groups;
        this.isLoading = false;
        console.log('Loaded Groups: ', groups)
      },
      error: (error) => {
        console.log('Error fetching projects: ', error)
        this.errorMessage = 'Failed to load groups. Please try again';
        this.isLoading = false;
      }
    });
  }

  loadProjectNames(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.projectService.getAllProjectsNames().subscribe({
      next: (projectNames) => {
        this.projectNames = projectNames;
        this.isLoading = false;
        console.log('Loaded Projects Names: ', projectNames);
      },
      error: (error) => {
        console.log('Error fetching projectNames: ', error)
        this.errorMessage = 'Failed to load projectNames. Please try again';
        this.isLoading = false;
      }
    })
  }

  private initForm() {
    this.groupForm = this.fb.group({
      groupName: new FormControl(null, [Validators.required]),
      projectId: new FormControl(null, [Validators.required]),
    })
  }

  onSubmit() {
    if (this.groupForm.invalid) {
      this.groupForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;

    const formValue = this.groupForm.value;
    const newGroup: GroupCreateRequestDto = {
      groupName: formValue.groupName,
      projectId: formValue.projectId
    };

    console.log("the new grouup",newGroup);

    this.groupService.createGroup(newGroup).subscribe({
      next: (createdGroup) => {
        console.log('Group created successfully', createdGroup);
        this.isSubmitting = false;
        this.loadGroups();
      },
      error: (error) => {
        console.log('Error creating group: ', error)
        this.errorMessage = 'Failed to create group. Please try again';
        this.isSubmitting = false;
      }
    });
  }

  editGroup(id: number): void {
    console.log('Edit Group', id);
    this.router.navigate(['/groups', id, 'edit']);
  }

  openAddGroupModal(): void {
    this.showAddGroupModal = true;
  }

  closeAddGroupModal(): void {
    this.showAddGroupModal = false;
  }

}
