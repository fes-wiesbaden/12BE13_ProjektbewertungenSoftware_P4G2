import { CanActivate, CanMatch, Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { AuthService } from '../auth/auth.service';

@Injectable({
  providedIn: 'root',
})
export class LoginGuard implements CanActivate, CanMatch {

  constructor(private authService: AuthService, private router: Router) {}

private check(): boolean {
  const role = this.authService.getRole();

  if (!role || !role.trim()) {
    return true;
  }

  this.router.navigate([`${role}/dashboard`]);
  return false; 
}

  canMatch(): boolean {
    return this.check();
  }

  canActivate(): boolean {
    return this.check();
  }
}
