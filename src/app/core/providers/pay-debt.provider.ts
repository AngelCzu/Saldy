import { inject } from '@angular/core';
import { Firestore } from '@angular/fire/firestore';

import { PayDebtUseCase } from 'src/app/features/debts/application/pay-debt.usecase';

import { FirestoreDatasource } from 'src/app/data/datasources/firestore.datasource';
import { FirestoreDebtRepository } from 'src/app/data/repositories/firestore-debt.repository';
import { FirestoreMovementRepository } from 'src/app/data/repositories/firestore-movement.repository';
import { FirestoreMonthlyPeriodRepository } from 'src/app/data/repositories/firestore-monthly-period.repository';
import { FirestoreTimeProvider } from 'src/app/data/services/firestore-time.provider';

import { SessionService } from '../session/session.service';

export function providePayDebtUseCase() {
  const firestore = inject(Firestore);
  const session = inject(SessionService);

  // Test: ensure a userId is set before building the use case
  if (!session.isAuthenticated()) {
    session.setUserId('user-demo-001');
  }

  const datasource = new FirestoreDatasource(firestore);
  const userId = session.getUserId();

  return new PayDebtUseCase(
    new FirestoreDebtRepository(datasource, userId),
    new FirestoreMovementRepository(datasource, userId),
    new FirestoreMonthlyPeriodRepository(datasource, userId),
    new FirestoreTimeProvider()
  );
}
