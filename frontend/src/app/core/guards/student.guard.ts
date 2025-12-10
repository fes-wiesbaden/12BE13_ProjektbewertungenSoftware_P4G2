import { CanActivate, Router } from "@angular/router";
import { Injectable } from "@angular/core";
import { AuthService } from "../auth/auth.service";

@Injectable({
  providedIn: 'root'
})
export class StudentGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) {}

  private check(): boolean {
    if (this.authService.getRole() === 'student') {
      return true;
    }
    this.router.navigate(['auth/login']);
    return false;
  }

  canActivate(): boolean {
    return this.check();
  }

  canMatch(): boolean {
    return this.check();
  }
}