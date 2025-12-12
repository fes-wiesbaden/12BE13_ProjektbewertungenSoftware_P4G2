import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, firstValueFrom, map, Observable, of } from 'rxjs';
import { Router } from '@angular/router';

interface LoginResponseDto {
  accessToken: string;
  refreshToken: string;
  tokenType: string;
  expiresInSeconds: number;
}

interface StoredUserData {
  token: string;
  refreshToken: string;
  tokenType: string;
  claims: Record<string, any>;
  expiresAt: number;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private loginUrl = 'http://localhost:4100/api/auth/login';
  private refreshUrl = 'http://localhost:4100/api/auth/refresh';
  private readonly storageKey = 'user';

  constructor(
    private http: HttpClient,
    private router: Router,
  ) {}


  private getStored(): StoredUserData | null {
    const raw = localStorage.getItem(this.storageKey);
    if (!raw) return null;
    try {
      return JSON.parse(raw) as StoredUserData;
    } catch {
      return null;
    }
  }

  private saveStored(data: StoredUserData): void {
    localStorage.setItem(this.storageKey, JSON.stringify(data));
  }

  private decodeToken(token: string): Record<string, any> | null {
    try {
      const base64Url = token.split('.')[1];
      if (!base64Url) return null;
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join(''),
      );
      return JSON.parse(jsonPayload);
    } catch (error) {
      console.error('Fehler beim Dekodieren des Tokens:', error);
      return null;
    }
  }

  async login(username: string, password: string): Promise<boolean> {
    try {
      const res = await firstValueFrom(
        this.http.post<LoginResponseDto>(this.loginUrl, { username, password }),
      );

      console.log('Request vom Backend', res);

      if (!res.accessToken) {
        console.error('Login fehlgeschlagen: Kein Token erhalten');
        return false;
      }

      const claims = this.decodeToken(res.accessToken) || {};
      console.log('JWT Claims:', claims);

      const now = Date.now();
      const expiresAt = now + res.expiresInSeconds * 1000;

      const stored: StoredUserData = {
        token: res.accessToken,
        refreshToken: res.refreshToken,
        tokenType: res.tokenType,
        claims,
        expiresAt,
      };

      this.saveStored(stored);
      return true;
    } catch (error) {
      console.error('Login fehlgeschlagen:', error);
      return false;
    }
  }


  getRefreshToken(): string {
    const stored = this.getStored();
    return stored?.refreshToken ?? '';
  }

  getTokenExpiry(): number {
    const stored = this.getStored();
    return stored?.expiresAt ?? 0;
  }

  refreshToken(): Observable<boolean> {
    const stored = this.getStored();
    if (!stored?.refreshToken) {
      return of(false);
    }

    return this.http
      .post<LoginResponseDto>(this.refreshUrl, {
        refreshToken: stored.refreshToken,
      })
      .pipe(
        map((res) => {
          if (!res.accessToken) return false;

          const claims = this.decodeToken(res.accessToken) || {};
          const now = Date.now();
          const expiresAt = now + res.expiresInSeconds * 1000;

          const newStored: StoredUserData = {
            token: res.accessToken,
            refreshToken: res.refreshToken,
            tokenType: res.tokenType,
            claims,
            expiresAt,
          };

          this.saveStored(newStored);
          return true;
        }),
        catchError((err) => {
          console.error('Refresh fehlgeschlagen', err);
          this.logout();
          return of(false);
        }),
      );
  }

  logout() {
    localStorage.removeItem(this.storageKey);
    this.router.navigate(['auth/login']);
  }

  isLoggedIn(): boolean {
    return this.getStored() != null;
  }


  getClaim(claimName: string): any {
    const stored = this.getStored();
    const claims = stored?.claims;
    return claims?.[claimName] ?? null;
  }

  getUsername(): string {
    return this.getClaim('username') || '';
  }

  getUserId(): string {
    return this.getClaim('sub') || '';
  }

  getRole(): string {
    const storedRaw = localStorage.getItem(this.storageKey);
    if (!storedRaw) return '';

    const stored = JSON.parse(storedRaw) as StoredUserData;
    const roleName = stored.claims?.['roleName'];

    return typeof roleName === 'string' ? roleName.toLowerCase() : '';
  }

  getRoleId(): number {
    const storedRaw = localStorage.getItem(this.storageKey);
    if (!storedRaw) return 0;

    const stored = JSON.parse(storedRaw) as StoredUserData;
    const roleId = stored.claims?.['roleId'];

    return typeof roleId === 'number' ? roleId : 0;
  }


  getAllClaims(): Record<string, any> {
    const stored = this.getStored();
    return stored?.claims ?? {};
  }

  getToken(): string {
    const stored = this.getStored();
    return stored?.token ?? '';
  }
}
