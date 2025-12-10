import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, firstValueFrom, map, Observable, of } from 'rxjs';
import users from './users.json';
import { Router } from '@angular/router';

interface LoginResponseDto {
  accessToken: string;
  tokenType: string; // z.B. "Bearer"
}

interface StoredUserData {
  token: string;
  tokenType: string;
  claims: Record<string, any>;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:4100/api/auth/login';
  private readonly storageKey = 'user';

  constructor(private http: HttpClient, private router: Router) {}

  // Hilfsmethode: JWT-Token dekodieren
  private decodeToken(token: string): Record<string, any> | null {
    try {
      const base64Url = token.split('.')[1];
      if (!base64Url) return null;
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      return JSON.parse(jsonPayload);
    } catch (error) {
      console.error('Fehler beim Dekodieren des Tokens:', error);
      return null;
    }
  }

  // Login-Methode
  async login(username: string, password: string): Promise<boolean> {
    try {
      const res = await firstValueFrom(
        this.http.post<LoginResponseDto>(this.apiUrl, { username, password })
      );

      console.log('Request vom Backend', res);

      if (!res.accessToken) {
        console.error('Login fehlgeschlagen: Kein Token erhalten');
        return false;
      }

      // Nur den reinen JWT-Token dekodieren
      const claims = this.decodeToken(res.accessToken) || {};
      console.log('JWT Claims:', claims); // ✅ Debug: alles aus dem JWT

      const stored: StoredUserData = {
        token: res.accessToken,
        tokenType: res.tokenType,
        claims
      };

      localStorage.setItem(this.storageKey, JSON.stringify(stored));
      return true;
    } catch (error) {
      console.error('Login fehlgeschlagen:', error);
      return false;
    }
  }

  logout() {
    localStorage.removeItem(this.storageKey);
    this.router.navigate(['auth/login']);
  }

  isLoggedIn(): boolean {
    const stored = localStorage.getItem(this.storageKey);
    return stored != null;
  }

  // Zugriff auf Claims
  getClaim(claimName: string): any {
    const stored = localStorage.getItem(this.storageKey);
    if (!stored) return null;
    const claims = JSON.parse(stored).claims;
    return claims?.[claimName] ?? null;
  }

  getUsername(): string {
    return this.getClaim('username') || '';
  }

  getUserId(): string {
    return this.getClaim('sub') || '';
  }

  getRole(): string {
    const stored = JSON.parse(localStorage.getItem('user') || '{}');
    return stored.claims?.roleName?.toLowerCase() || '';
  }
  getRoleId(): number {
    const stored = JSON.parse(localStorage.getItem('user') || '{}');
    return stored.claims?.roleId || 0;
  }

  getAllClaims(): Record<string, any> {
    const stored = localStorage.getItem(this.storageKey);
    return stored ? JSON.parse(stored).claims : {};
  }
  
  getToken(): string {
  const stored = localStorage.getItem(this.storageKey);
  return stored ? JSON.parse(stored).token : '';
}
}