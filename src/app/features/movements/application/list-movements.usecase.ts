import { Movement } from 'src/app/domain/entities/movement.entity';
import { MovementRepository } from 'src/app/domain/repositories/movement.repository';
import { TimeProvider } from 'src/app/domain/services/time-provider';

import { Inject, Injectable } from '@angular/core';
import { MOVEMENT_REPOSITORY } from 'src/app/core/providers/tokens';

@Injectable({ providedIn: 'root' })
export class ListMovementsUseCase {
  constructor(
    @Inject(MOVEMENT_REPOSITORY)
    private readonly movementRepository: MovementRepository,
    private readonly timeProvider: TimeProvider
  ) {}

  async execute(): Promise<Movement[]> {
    const yearMonth = this.timeProvider.currentYearMonth();

    return this.movementRepository.findByPeriod(yearMonth);
  }
}
