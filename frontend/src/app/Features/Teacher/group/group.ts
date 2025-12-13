import {Component, input, computed, signal, OnInit} from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { DatePipe, NgClass, CommonModule } from '@angular/common';
import {Router, RouterLink} from '@angular/router';
import {GroupCreateRequestDto, IGroup} from '../../../core/modals/group.modal';
import {FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {GroupService} from '../../../core/services/group.service';
import {GroupMapperService} from '../../../core/services/group.mapper.service';
import {ProjectService} from '../../../core/services/project.service';
import {UserService} from '../../../Shared/Services/user.service';
import {GroupAddMemberRequestDto, GroupAddMembersRequestDto, StudentList} from '../../../core/modals/users.modal';
import {User} from '../../../Shared/models/user.interface';

@Component({
  selector: 'app-group',
  standalone: true,
  imports: [MatIcon, CommonModule, RouterLink, ReactiveFormsModule],
  templateUrl: './group.html',
  styleUrls: ['./group.css'],
})
export class Group implements OnInit {
  groupId = input.required<string>();
  showAddStudentModal: boolean = false;
  group = signal<IGroup | undefined>(undefined);
  students: StudentList[] = [];
  selectedStudents: Set<string> = new Set(); // Track selected student IDs
  isLoadingStudents = false;
  isLoading = false;
  errorMessage= '';
  groupForm!: FormGroup;
  isSubmitting = false;

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private groupService: GroupService,
    private mapper: GroupMapperService,
    private projectService: ProjectService,
    private userservice: UserService,
  ) {
    this.initForm();
  }

  private initForm() {
    this.groupForm = this.fb.group({
      memberId: new FormControl('', [Validators.required]),
      groupId: new FormControl('', [Validators.required]),
    })
  }

  ngOnInit(): void {
    this.loadGroup();
    this.loudStudents();
  }

  loadGroup(): void {
    this.isLoading = true;
    this.errorMessage = '';
    const id = String(this.groupId());

    this.groupService.getGroupById(id).subscribe({
      next: (group: IGroup) => {
        this.group.set(group);
        this.isLoading = false;
        this.loudStudents();
        console.log('Loaded Group: ', group)
      },
      error: (error) => {
        console.log('Error fetching group: ', error)
        this.errorMessage = 'Failed to load group. Please try again';
        this.isLoading = false;
      }
    });
  }

  loudStudents(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.userservice.getUsersByRoleId(2).subscribe({
      next: (users: User[]) => {
        this.students = this.mapper.userResponseDtoToStudentList(users);
        this.isLoading = false;
        console.log("Users loaded successfully.", users);
      },
      error: (error) => {
        console.log('Error fetching users: ', error)
        this.errorMessage = error.message;
        this.isLoading = false;
      }
    })
  }

  onSubmit() {
    if (this.groupForm.invalid) {
      this.groupForm.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;

    const formValue = this.groupForm.value;
    const newMember: GroupAddMemberRequestDto = {
      memberId: formValue.memberId,
      groupId: formValue.groupId,
    };

    console.log("Creating new group:", newMember);

    this.groupService.addMemberToGroup(newMember).subscribe({
      next: (createdGroup) => {
        console.log('Group created successfully', createdGroup);
        this.isSubmitting = false;
        this.closeAddStudentModal();
        this.loadGroup();
      },
      error: (error) => {
        console.log('Error creating group: ', error)
        this.errorMessage = 'Failed to create group. Please try again';
        this.isSubmitting = false;
      }
    });
  }

  // Toggle student selection
  toggleStudentSelection(studentId: string): void {
    if (this.selectedStudents.has(studentId)) {
      this.selectedStudents.delete(studentId);
    } else {
      this.selectedStudents.add(studentId);
    }
  }

  // Check if student is selected
  isStudentSelected(studentId: string): boolean {
    return this.selectedStudents.has(studentId);
  }

  // Add selected students to group
  addSelectedStudentsToGroup(): void {
    if (this.selectedStudents.size === 0) {
      this.errorMessage = 'Please select at least one student';
      return;
    }

    this.isSubmitting = true;
    const studentIds = Array.from(this.selectedStudents);

    const newMembers: GroupAddMembersRequestDto = {
      memberId: studentIds,
      groupId: this.groupId(),
    };


    // Call your API to add students to group
    // Adjust this based on your API endpoint
    this.groupService.addMembersToGroup(newMembers).subscribe({
      next: () => {
        console.log('Students added successfully');
        this.isSubmitting = false;
        this.selectedStudents.clear();
        this.closeAddStudentModal();
        this.loadGroup(); // Reload group to show new members
      },
      error: (error) => {
        console.log('Error adding students: ', error);
        this.errorMessage = 'Failed to add students. Please try again';
        this.isSubmitting = false;
      }
    });
  }

  // Filter students that are not already in the group
  get availableStudents(): StudentList[] {
    const currentGroup = this.group();
    if (!currentGroup || !currentGroup.members) {
      return this.students;
    }

    const memberIds = currentGroup.members.map(m => m.id);
    return this.students.filter(s => !memberIds.includes(s.id));
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

  openAddStudentModal(): void {
    this.showAddStudentModal = true;
  }

  closeAddStudentModal(): void {
    this.showAddStudentModal = false;
    this.groupForm.reset();
    this.errorMessage = '';
  }
}
