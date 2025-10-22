import { CanActivateFn, Router } from '@angular/router';
import { Auth } from '../services/auth';
import { inject } from '@angular/core';

export const authGuard: CanActivateFn = (route, state) => {
  const auth = inject(Auth);
  const router = inject(Router);

  //if user is not logged, then redirect to login page
  if(!auth.isAuthenticated()){
    router.navigate(['/login']);
    return false;
  }

  //only SELLER can have access to this page
  const allowedRoles = route.data?.['roles'] as string[];
  const userRole = auth.getUserRole();

  if(allowedRoles && !allowedRoles.includes(userRole!)){
    //if user role is not allowed, redirect to homepage
    alert("You don't have permission to access this page.");
    router.navigate(['/']);
    return false;
  }
  return true;
};
