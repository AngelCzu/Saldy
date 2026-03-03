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


  const datasource = new FirestoreDatasource(firestore, session);

  return new PayDebtUseCase(
    new FirestoreDebtRepository(datasource),
    new FirestoreMovementRepository(datasource),
    new FirestoreMonthlyPeriodRepository(datasource),
    new FirestoreTimeProvider()
  );
}
