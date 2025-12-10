import { Component } from '@angular/core';
import { RouterOutlet } from "@angular/router";
import { Navbar } from "../../Shared/Components/navbar/navbar";

@Component({
  selector: 'app-auth-layout',
  imports: [RouterOutlet, Navbar],
  templateUrl: './auth-layout.html',
  styleUrl: './auth-layout.css'
})
export class AuthLayout {

}
