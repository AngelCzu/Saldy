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

  // Test: ensure a userId is set before building the use case
  if (!session.isAuthenticated()) {
    session.setUserId('user-demo-001');
  }

  const datasource = new FirestoreDatasource(firestore);
  const userId = session.getUserId();

  return new RegisterSharedExpenseUseCase(
    new FirestoreMovementRepository(datasource, userId),
    new FirestoreDebtRepository(datasource, userId),
    new FirestoreMonthlyPeriodRepository(datasource, userId),
    new FirestoreTimeProvider()
  );
}
