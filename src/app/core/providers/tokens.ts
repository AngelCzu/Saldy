import { InjectionToken } from '@angular/core';
import { AutoCloseMonthlyPeriodUseCase } from
'src/app/features/periods/application/auto-close-monthly-period.usecase';
import { AuthRepository } from 'src/app/domain/repositories/auth.repository';

export const AUTO_CLOSE_PERIOD =
  new InjectionToken<AutoCloseMonthlyPeriodUseCase>(
    'AUTO_CLOSE_PERIOD'
  );

export const AUTH_REPOSITORY =
  new InjectionToken<AuthRepository>(
    'AUTH_REPOSITORY'
  );
