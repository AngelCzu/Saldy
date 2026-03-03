import { inject } from '@angular/core';
import { Firestore } from '@angular/fire/firestore';

import { RegisterSharedExpenseUseCase } from 'src/app/features/movements/application/register-shared-expense.usecase';

import { FirestoreDatasource } from 'src/app/data/datasources/firestore.datasource';
import { FirestoreDebtRepository } from 'src/app/data/repositories/firestore-debt.repository';
import { FirestoreMovementRepository } from 'src/app/data/repositories/firestore-movement.repository';
import { FirestoreMonthlyPeriodRepository } from 'src/app/data/repositories/firestore-monthly-period.repository';
import { FirestoreTimeProvider } from 'src/app/data/services/firestore-time.provider';

import { SessionService } from 'src/app/core/session/session.service';

export function provideRegisterSharedExpenseUseCase() {
  const firestore = inject(Firestore);
  const session = inject(SessionService);



  const datasource = new FirestoreDatasource(firestore, session);

  return new RegisterSharedExpenseUseCase(
    new FirestoreMovementRepository(datasource),
    new FirestoreDebtRepository(datasource),
    new FirestoreMonthlyPeriodRepository(datasource),
    new FirestoreTimeProvider()
  );
}
