import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { DbService } from '../services/db-service';
import { catchError, switchMap, throwError, EMPTY } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const db = inject(DbService);
  const token = localStorage.getItem('access_token');
  let authReq = req;

  // Attach Authorization header if token exists
  if (token) {
    authReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  return next(authReq).pipe(
    catchError((error) => {
      // Ignore refresh errors to prevent infinite loops
      const isRefreshCall = req.url.includes('/refresh');

      if (error.status === 401 && !isRefreshCall) {
        const hasToken = !!localStorage.getItem('access_token');
        if (!hasToken) {
          console.warn('401 without token, skipping refresh.');
          return throwError(() => error);
        }

        console.log('Attempting token refresh...');

        return db.refreshAccessToken().pipe(
          switchMap((res: any) => {
            const newToken = res.accessTokens;
            if (!newToken) {
              console.warn('No new token returned — forcing logout.');
              localStorage.removeItem('access_token');
              return throwError(() => error);
            }

            localStorage.setItem('access_token', newToken);
            const retryReq = req.clone({
              setHeaders: { Authorization: `Bearer ${newToken}` },
            });
            return next(retryReq);
          }),
          catchError((err) => {
            console.warn('Refresh failed — logging out.');
            localStorage.removeItem('access_token');
            return throwError(() => err);
          })
        );
      }

      return throwError(() => error);
    })
  );
};
