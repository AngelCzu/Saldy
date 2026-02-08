import { inject } from '@angular/core';
import { Firestore } from '@angular/fire/firestore';

import { SessionService } from '../session/session.service';
import { FirestoreDatasource } from 'src/app/data/datasources/firestore.datasource';
import { FirestoreMovementRepository } from 'src/app/data/repositories/firestore-movement.repository';
import { FirestoreTimeProvider } from 'src/app/data/services/firestore-time.provider';

import { ListMovementsUseCase } from 'src/app/features/movements/application/list-movements.usecase';

export function provideListMovementsUseCase() {
  const firestore = inject(Firestore);
  const session = inject(SessionService);

  const datasource = new FirestoreDatasource(firestore);
  const userId = session.getUserId();
  
  const movementRepo = new FirestoreMovementRepository(datasource, userId);
  const timeProvider = new FirestoreTimeProvider();

  return new ListMovementsUseCase(movementRepo, timeProvider);
}
