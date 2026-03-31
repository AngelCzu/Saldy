import { inject, Injectable } from '@angular/core';
import { Debt } from 'src/app/domain/entities/debt.entity';
import {
  RegisterMovementCommand,
  RegisterMovementUseCase,
} from './register-movement.usecase';
import { SharedExpenseData } from '../models/shared-expense.model';
import { MovementValidator } from 'src/app/domain/validators/movement.validator';
import { MOVEMENT_REPOSITORY } from 'src/app/core/providers/tokens';
import { Movement } from 'src/app/domain/entities/movement.entity';

import { TimeProvider } from 'src/app/domain/services/time-provider';
import { GetOrCreateCurrentPeriodUseCase } from '../../periods/application/GetOrCreateCurrentPeriodUseCase';
import { YearMonth } from 'src/app/domain/value-objects/year-month.vo';
import { IdempotencyService } from 'src/app/core/services/idempotency.service';
@Injectable({ providedIn: 'root' })
export class RegisterSharedExpenseUseCase {
  private readonly movementRepository = inject(MOVEMENT_REPOSITORY);
  private readonly getOrCreatePeriodUseCase = inject(GetOrCreateCurrentPeriodUseCase);
  private readonly timeProvider = inject(TimeProvider);

  private idempotency = inject(IdempotencyService)

  private buildKey(params: {
    movement: RegisterMovementCommand;
    sharedData: SharedExpenseData;
  }): string {

    const amount =
      params.movement.currency === 'CLP'
        ? params.movement.amountCLP
        : params.movement.inputAmount;

    return `shared-${params.movement.title}-${amount}-${params.sharedData.participants.length}`;
  }

  async execute(params: {
    movement: RegisterMovementCommand;
    sharedData: SharedExpenseData;
  },key?: string ): Promise<void> {

    const finalKey = key ?? this.buildKey(params);


    return this.idempotency.execute(finalKey, async () => {
      const { sharedData } = params;

      // =========================
      // VALIDACIONES SERIAS
      // =========================

      const now = this.timeProvider.now();
      const yearMonth = this.timeProvider.currentYearMonth();


      // =========================
      // CREAR MOVIMIENTO (SIN GUARDAR)
      // =========================

      const period = await this.getOrCreatePeriodUseCase.execute();

      if (period.isClosed()) {
        throw new Error('El período está cerrado.');
      }


      const debts = MovementValidator.extractDebts(sharedData);

      
      const movement = Movement.createFromCommand({
        ...params.movement,
        yearMonth,
        createdAt: now,
        isShared: true,
        sharedData: params.sharedData
      });

      // =========================
      // ==== Guardado Atomico ====
      // =========================
      await this.movementRepository.saveSharedExpense(movement, (movementId) =>
        debts.map(d =>
          Debt.create({
            movementId,
            ...d
          })
        )
      );




    });
  }

  
}
