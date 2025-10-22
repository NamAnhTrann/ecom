import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { DbService } from '../services/db-service';
import { catchError, switchMap, throwError } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  //inject the database service manually since we're in a function
  const db = inject(DbService);
  const token = localStorage.getItem('auth_token');
  let authReq = req;

  //if the token exist, we can attach it to every request 
  if(token){
    authReq = req.clone({
      setHeaders:{
        Authorization : `Bearer ${token}`
      }
    });
  }

  return next(authReq).pipe(
    catchError(error =>{
      //if we get a 401 unauthorized response, we can log the user out
      if(error.status === 401){
        return db.refreshAccessToken().pipe(
          switchMap((res:any)=>{
            //backend return the new access tokens in accessTokens field
            const newToken = res.accessTokens;
            localStorage.setItem('auth_token', newToken);
            //retry the failed request with the new token
            const retryReq = req.clone({
              setHeaders: {
                Authorization: `Bearer ${newToken}`
              }
            });
            return next(retryReq);
          }),
          catchError((err)=>{
            //if refresh fails, user must login again
            localStorage.removeItem('auth_token');
            return throwError(() => err);
          })
      );
    }
    //if not a 401 error, then just pass the error
    return throwError(() => error);
    })
  );

};
