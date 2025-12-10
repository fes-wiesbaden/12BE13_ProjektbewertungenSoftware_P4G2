import { Component } from '@angular/core';
import { Sidebar } from '../../../layout/sidebar/sidebar';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-my-profile',
  imports: [ MatCardModule, MatListModule, MatIconModule],
  templateUrl: './my-profile.html',
  styleUrl: './my-profile.css',
})
export class MyProfile {
  project = 'projekt 4';
  user = 'Vorname Nachname';
  group = 'Gruppe 1';

  learningFieldsCount = 0;

  learningFields: string[] = [
    'Präsentation',
    'Dokumentation',
    'PoWi',
    'Deutsch',
    'Rel./Eth.',
    'LF 1 Das Unternehmen und die eigene Rolle im Betrieb beschreiben',
    'LF 2 Arbeitsplätze nach Kundenwunsch ausstatten beschreiben',
    'LF 3 Clients in Netzwerke einbinden',
    'LF 4 Schutzbedarfsanalyse im eigenen Arbeitsbereich durchführen',
    'LF 5 Software zur Verwaltung von Daten anpassen durchführen',
  ];

  teachers = [
    { id: 0, name: 'Faisel Bekkaoui' },
    { id: 1, name: 'Jan-Christoph Fuchs' },
    { id: 2, name: 'Torsten Sommerfeld' },
    { id: 3, name: 'Nicole Elborg' },
  ];

  grades = [
    { id: 0, grade: 2 },
    { id: 1, grade: 3 },
    { id: 2, grade: 3 },
    { id: 3, grade: 1 },
  ];
  overallGrade = 2;

  changeLearningField(msg: string) {
    console.log(msg);
    console.log(this.learningFieldsCount);
    if (msg === 'up') {
        if (this.learningFieldsCount + 1 < 9) {
        this.learningFieldsCount += 1;
        }
        else{
          this.learningFieldsCount = 0;
        }
      } else if (msg == 'down') {
        if(this.learningFieldsCount - 1 >= 0){
          this.learningFieldsCount -= 1;
        }
        else{
          this.learningFieldsCount = 9;
        }
      }
      else{
        console.log('fehler');
      }
    }
  }
