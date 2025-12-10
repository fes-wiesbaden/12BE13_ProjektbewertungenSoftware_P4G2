import { Component } from '@angular/core';
import { Sidebar } from "../../../layout/sidebar/sidebar";
import { MatIcon } from "@angular/material/icon";
import { DashboardNavbar } from "../../../layout/dashboard-navbar/dashboard-navbar";

export interface Student {
id: number;
firstName: string;
lastName: string;
email: string;
} 
@Component({
  selector: 'app-my-classes',
  imports: [Sidebar, MatIcon, DashboardNavbar],
  templateUrl: './my-classes.html',
  styleUrl: './my-classes.css'
})
export class MyClasses {

  students : Student[]=[
    { id: 0, firstName: 'Max' ,lastName :'Mustermann',email:'test@email.com'},
    { id: 1, firstName: 'Rainer' ,lastName :'Zufall',email:'test@email.de'},
    { id: 2, firstName: 'Peter' ,lastName :'Silie',email:'123@email.com'},
    { id: 3, firstName: 'Tim' ,lastName :'Buktu',email:'email@email.com'},
    { id: 4, firstName: 'Anna' ,lastName :'Log',email:'e@mail.txt'},
    { id: 5, firstName: 'Mona' ,lastName :'Lisa',email:'mona@lisa.koop'},
  ];

}
