import { Component } from '@angular/core';
import { Sidebar } from '../../../layout/sidebar/sidebar';
import { MatIcon } from '@angular/material/icon';
import { DashboardNavbar } from '../../../layout/dashboard-navbar/dashboard-navbar';
import { GroupService } from '../../../Shared/Services/group-member.service';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../core/auth/auth.service';

export interface Student {
  id: string;
  fullName: string;
}

export interface Group {
  id: string;
  groupName: string;
  groupId: string;
}


@Component({
  selector: 'app-my-classes',
  standalone: true,
  imports: [Sidebar, MatIcon, DashboardNavbar, FormsModule],
  templateUrl: './my-classes.html',
  styleUrl: './my-classes.css',
})
export class MyClasses {
  groupsWithMembers: (Group & { members: Student[]; open: boolean })[] = [];

  constructor(
    private groupService: GroupService,
    private authService: AuthService,
  ) {}

  ngOnInit() {
    this.loadGroupsWithMembers();
  }

  loadGroupsWithMembers() {
    // Alle Gruppen des aktuellen Benutzers laden
    this.groupService.getAllGroupsForMember(this.authService.getUserId()).subscribe({
      next: (groups: Group[]) => {
        this.groupsWithMembers = groups.map(g => ({
          ...g,
          open: false, // für das Accordion
          members: []  // Platzhalter für Mitglieder
        }));

        // Für jede Gruppe die Mitglieder laden
        this.groupsWithMembers.forEach(group => {
          console.log(group);
          this.groupService.getMembersByGroupId(group.groupId).subscribe({
            next: (members: any[]) => {
              console.log('lllll',members)
              group.members = members.map(m => ({
                id: m.id,
                fullName: m.fullName
              }));
            },
            error: (err) => console.error(`Fehler beim Laden der Mitglieder für Gruppe ${group.id}`, err)
          });
        });
        console.log(this.groupsWithMembers);
      },
      error: (err) => console.error("Fehler beim Laden der Gruppen", err)
    });
  }
}
