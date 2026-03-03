import { inject } from '@angular/core';
import { Firestore } from '@angular/fire/firestore';

import { AutoCloseMonthlyPeriodUseCase } from
'src/app/features/periods/application/auto-close-monthly-period.usecase';

import { FirestoreDatasource } from
'src/app/data/datasources/firestore.datasource';

import { FirestoreMonthlyPeriodRepository } from
'src/app/data/repositories/firestore-monthly-period.repository';

import { FirestoreDebtRepository } from
'src/app/data/repositories/firestore-debt.repository';

import { FirestoreTimeProvider } from
'src/app/data/services/firestore-time.provider';

import { SessionService } from
'src/app/core/session/session.service';

export function provideAutoCloseMonthlyPeriodUseCase() {
  const firestore = inject(Firestore);
  const session = inject(SessionService);

  const datasource = new FirestoreDatasource(firestore, session);

  return new AutoCloseMonthlyPeriodUseCase(
    new FirestoreMonthlyPeriodRepository(datasource),
    new FirestoreDebtRepository(datasource),
    new FirestoreTimeProvider()
  );
}