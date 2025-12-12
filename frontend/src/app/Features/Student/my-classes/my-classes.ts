import { Component } from '@angular/core';
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
  imports: [FormsModule],
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
        this.groupsWithMembers = groups.map((g) => ({
          ...g,
          open: false, // für das Accordion
          members: [], // Platzhalter für Mitglieder
        }));

        // Für jede Gruppe die Mitglieder laden
        this.groupsWithMembers.forEach((group) => {
          this.groupService.getMembersByGroupId(group.groupId).subscribe({
            next: (members: any[]) => {
              group.members = members.map((m) => ({
                id: m.id,
                fullName: m.fullName,
              }));
            },
            error: (err) =>
              console.error(`Fehler beim Laden der Mitglieder für Gruppe ${group.id}`, err),
          });
        });
      },
      error: (err) => console.error('Fehler beim Laden der Gruppen', err),
    });
  }
}
