import { Movement } from 'src/app/domain/entities/movement.entity';
import { Debt } from 'src/app/domain/entities/debt.entity';


import { MovementRepository } from 'src/app/domain/repositories/movement.repository';
import { DebtRepository } from 'src/app/domain/repositories/debt.repository';
import { MonthlyPeriodRepository } from 'src/app/domain/repositories/monthly-period.repository';

import { TimeProvider } from 'src/app/domain/services/time-provider';
import { MonthlyPeriod } from 'src/app/domain/entities/monthly-period.entity';
import { Inject, Injectable } from '@angular/core';
import {
  DEBT_REPOSITORY,
  MONTHLY_PERIOD_REPOSITORY,
  MOVEMENT_REPOSITORY
} from 'src/app/core/providers/tokens';

@Injectable({ providedIn: 'root' })
export class RegisterSharedExpenseUseCase {
  constructor(
    @Inject(MOVEMENT_REPOSITORY)
    private readonly movementRepository: MovementRepository,
    @Inject(DEBT_REPOSITORY)
    private readonly debtRepository: DebtRepository,
    @Inject(MONTHLY_PERIOD_REPOSITORY)
    private readonly periodRepository: MonthlyPeriodRepository,
    private readonly timeProvider: TimeProvider
  ) {}

  async execute(params: {
    amount: number;
    description: string;
    category: string;
    participants: {
      name: string;
      amount: number;
    }[];
  }): Promise<void> {

    // 1️⃣ Período actual
    const yearMonth = this.timeProvider.currentYearMonth();

    let period = await this.periodRepository.findByYearMonth(yearMonth);

    // 🔹 Si no existe, se crea automáticamente
    if (!period) {
      period = MonthlyPeriod.create(yearMonth);
      await this.periodRepository.save(period);
    }

    // 🔹 Si existe pero está cerrado, se bloquea
    if (period.isClosed()) {
      throw new Error('El período está cerrado.');
    }

    // 2️⃣ Crear movimiento de gasto
    const expense = Movement.create({
      type: 'EXPENSE',
      amount: params.amount,
      yearMonth,
      description: params.description,
      category: params.category,
      isShared: true,
    });

    const movementId = await this.movementRepository.save(expense);

    // 3️⃣ Crear deudas
    for (const participant of params.participants) {
      const debt = Debt.create({
        movementId,
        debtorName: participant.name,
        amount: participant.amount,
      });

      await this.debtRepository.save(debt);
    }
  }
}
