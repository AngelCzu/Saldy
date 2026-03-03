import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { SessionService } from '../session/session.service';
import { filter, map, take } from 'rxjs/operators';
import { combineLatest } from 'rxjs';

export const AuthGuard: CanActivateFn = () => {
  const session = inject(SessionService);
  const router = inject(Router);

  return combineLatest([session.authInitialized$, session.user$]).pipe(
    filter(([authInitialized]) => authInitialized),
    take(1),
    map(([, user]) => {
      return user ? true : router.createUrlTree(['/login']);
    })
  );
};
