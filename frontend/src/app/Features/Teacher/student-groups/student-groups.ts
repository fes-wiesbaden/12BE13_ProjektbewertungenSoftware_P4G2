import { Component, OnInit } from '@angular/core';
import { MatIcon } from "@angular/material/icon";
import { IGroup, IProject } from '../project/project';
import { RouterLink } from "@angular/router";

export interface Student{
  id: number,
  name: string,
}

export interface Group{
  groupId: number,
  groupName: string,
  students: Student[]
}



@Component({
  selector: 'app-student-groups',
  imports: [MatIcon, RouterLink],
  templateUrl: './student-groups.html',
  styleUrl: './student-groups.css'
})
export class StudentGroups implements OnInit {
  showAddGroupModal: boolean = false;
  groups: IGroup[] = [];
ngOnInit(): void {
this.loadGroups();
}

loadGroups(): void{
  this.groups = [
        { id: 1, name: "Group 1", members: ["Alice", "Bob", "Charlie"] },
        { id: 2, name: "Group 2", members: ["Alice", "Bob", "Charlie"] },
        { id: 3, name: "Group 3", members: ["Alice", "Bob", "Charlie"] },
        { id: 4, name: "Group 4", members: ["Alice", "Bob", "Charlie"] },
        { id: 5, name: "Group 5", members: ["Alice", "Bob", "Charlie"] },
      ]
}

openAddGroupModal(): void {
  this.showAddGroupModal = true;
}

closeAddGroupModal(): void {
  this.showAddGroupModal = false;
}

}
