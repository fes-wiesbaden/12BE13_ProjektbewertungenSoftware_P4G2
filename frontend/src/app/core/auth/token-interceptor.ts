import {
  HttpErrorResponse,
  HttpInterceptorFn,
} from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from './auth.service';
import { catchError, switchMap, throwError } from 'rxjs';

export const tokenInterceptor: HttpInterceptorFn = (req, next) => {
  const auth = inject(AuthService);

  const isApiRequest = req.url.startsWith('http://localhost:4100');
  const isRefreshRequest = req.url.includes('/api/auth/refresh');

  if (!isApiRequest) {
    return next(req);
  }

  const token = auth.getToken();
  const expiresAt = auth.getTokenExpiry();
  const now = Date.now();
  const isExpired = !expiresAt || now >= expiresAt;
  const willExpireSoon = expiresAt && now + 5000 >= expiresAt;

  const addAuthHeader = (jwt: string) =>
    req.clone({
      setHeaders: {
        Authorization: `Bearer ${jwt}`,
      },
    });


  if (isRefreshRequest) {
    return next(req);
  }

  const sendWithToken = (jwt: string) =>
    next(addAuthHeader(jwt)).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status !== 401 && error.status !== 403) {
          return throwError(() => error);
        }

        console.warn('[Interceptor] 401/403, versuche Refresh als Fallback…', error);

        return auth.refreshToken().pipe(
          switchMap((success) => {
            if (!success) {
              auth.logout();
              return throwError(() => error);
            }

            const fresh = auth.getToken();
            if (!fresh) {
              auth.logout();
              return throwError(
                () => new Error('Kein neuer Access-Token nach Refresh'),
              );
            }

            const retryReq = addAuthHeader(fresh);
            return next(retryReq);
          }),
        );
      }),
    );

  if (!token) {
    return next(req);
  }

  if (isExpired || willExpireSoon) {
    console.log(
      '[Interceptor] Token abgelaufen / läuft ab, rufe /api/auth/refresh auf…',
    );

    return auth.refreshToken().pipe(
      switchMap((success) => {
        if (!success) {
          auth.logout();
          return throwError(() => new Error('Refresh fehlgeschlagen'));
        }

        const fresh = auth.getToken();
        if (!fresh) {
          auth.logout();
          return throwError(
            () => new Error('Kein neuer Access-Token nach Refresh'),
          );
        }

        const newReq = addAuthHeader(fresh);
        return next(newReq);
      }),
      catchError((err) => {
        console.error('[Interceptor] Refresh-Fehler', err);
        auth.logout();
        return throwError(() => err);
      }),
    );
  }

  return sendWithToken(token);
};
