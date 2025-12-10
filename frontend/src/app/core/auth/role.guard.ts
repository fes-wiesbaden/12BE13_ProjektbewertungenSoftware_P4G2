import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {
  constructor(private auth: AuthService, private router: Router){}


  canActivate(route: ActivatedRouteSnapshot ) : boolean {
    const expectedRoles = route.data['roles'] as string[];
    const userRole = this.auth.getRole();

    if (expectedRoles.includes(userRole)){
      return true;
    }

    this.router.navigate(['/dashboard']);
    return false;
  }
};
