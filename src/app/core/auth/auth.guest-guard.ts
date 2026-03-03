import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { SessionService } from '../session/session.service';
import { combineLatest } from 'rxjs';
import { filter, map, take } from 'rxjs/operators';

export const GuestGuard: CanActivateFn = () => {
  const session = inject(SessionService);
  const router = inject(Router);

  return combineLatest([session.authInitialized$, session.user$]).pipe(
    filter(([initialized]) => initialized),
    take(1),
    map(([, user]) => {
      return user
        ? router.createUrlTree(['/home'])
        : true;
    })
  );
};