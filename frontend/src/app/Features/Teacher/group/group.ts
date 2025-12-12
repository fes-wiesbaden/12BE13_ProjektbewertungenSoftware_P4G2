import {Component, input, computed, signal, OnInit} from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { DatePipe, NgClass, CommonModule } from '@angular/common';
import {Router, RouterLink} from '@angular/router';
import {GroupCreateRequestDto, IGroup} from '../../../core/modals/group.modal';
import {FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {GroupService} from '../../../core/services/group.service';
import {GroupMapperService} from '../../../core/services/group.mapper.service';
import {ProjectService} from '../../../core/services/project.service';

@Component({
  selector: 'app-group',
  standalone: true,
  imports: [MatIcon, DatePipe, NgClass, CommonModule, RouterLink, ReactiveFormsModule],
  templateUrl: './group.html',
  styleUrls: ['./group.css'],
})
export class Group implements OnInit {
  groupId = input.required<string>();
  showAddGroupModal: boolean = false;
  group = signal<IGroup | undefined>(undefined);
  isLoading = false;
  errorMessage= '';
  groupForm!: FormGroup;
  isSubmitting = false;

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private groupService: GroupService,
    private mapper: GroupMapperService,
    private projectService: ProjectService
  ) {
    this.initForm();
  }

  private initForm() {
    this.groupForm = this.fb.group({
      groupName: new FormControl('', [Validators.required]),
      projectId: new FormControl('', [Validators.required]),
    })
  }

  ngOnInit(): void {
    this.loadGroups();
  }

  loadGroups(): void {
    this.isLoading = true;
    this.errorMessage = '';
    const id = String(this.groupId());

    this.groupService.getGroupById(id).subscribe({
      next: (group: IGroup) => {
        this.group.set(group);
        this.isLoading = false;
        console.log('Loaded Group: ', group)
      },
      error: (error) => {
        console.log('Error fetching group: ', error)
        this.errorMessage = 'Failed to load group. Please try again';
        this.isLoading = false;
      }
    });
  }

  onSubmit() {
    if (this.groupForm.invalid) {
      this.groupForm.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;

    const formValue = this.groupForm.value;
    const newGroup: GroupCreateRequestDto = {
      groupName: formValue.groupName,
      projectId: formValue.projectId
    };

    console.log("Creating new group:", newGroup);

    this.groupService.createGroup(newGroup).subscribe({
      next: (createdGroup) => {
        console.log('Group created successfully', createdGroup);
        this.isSubmitting = false;
        this.closeAddGroupModal();
        this.loadGroups();
      },
      error: (error) => {
        console.log('Error creating group: ', error)
        this.errorMessage = 'Failed to create group. Please try again';
        this.isSubmitting = false;
      }
    });
  }

  // ✅ Computed signal
  currentGroup = computed(() => this.group());

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

  openAddGroupModal(): void {
    this.showAddGroupModal = true;
  }

  closeAddGroupModal(): void {
    this.showAddGroupModal = false;
    this.groupForm.reset();
    this.errorMessage = '';
  }
}
