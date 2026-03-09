import { InjectionToken } from '@angular/core';
import { AuthRepository } from 'src/app/domain/repositories/auth.repository';
import { DebtRepository } from 'src/app/domain/repositories/debt.repository';
import { MovementRepository } from 'src/app/domain/repositories/movement.repository';
import { MonthlyPeriodRepository } from 'src/app/domain/repositories/monthly-period.repository';

export const AUTH_REPOSITORY =
  new InjectionToken<AuthRepository>(
    'AUTH_REPOSITORY'
  );

export const MOVEMENT_REPOSITORY =
  new InjectionToken<MovementRepository>(
    'MOVEMENT_REPOSITORY'
  );

export const DEBT_REPOSITORY =
  new InjectionToken<DebtRepository>(
    'DEBT_REPOSITORY'
  );

export const MONTHLY_PERIOD_REPOSITORY =
  new InjectionToken<MonthlyPeriodRepository>(
    'MONTHLY_PERIOD_REPOSITORY'
  );
