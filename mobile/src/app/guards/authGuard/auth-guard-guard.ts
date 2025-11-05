import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { filter, map, Observable, take } from 'rxjs';
import { AuthService } from 'src/app/services/authService/auth-service';

export const authGuardGuard: CanActivateFn = (route, state) => {
  //constructor
  const authService = inject(AuthService); 
  const router = inject(Router);

  //return the observable, that is resolved by Angular
  return authService.isAuthenticated$.pipe(
    //filter gets the expected result
    filter(isAuthenticated => isAuthenticated !== undefined),

    //gets the first value and complete
    take(1),

    //say if is or not authenticated
    map(isAuthenticated => {
      if(isAuthenticated){
        return true;
      } else {
        console.warn("AuthGuard: Acesso negado! Redirecionando para login..")
        return router.createUrlTree(['/login']);
      }
    })
  )
};
