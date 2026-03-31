// Marcar como deuda pagada

import { DebtRepository } from 'src/app/domain/repositories/debt.repository';
import { Movement } from 'src/app/domain/entities/movement.entity';
import { YearMonth } from 'src/app/domain/value-objects/year-month.vo';
import { Debt } from 'src/app/domain/entities/debt.entity';
import { MovementRepository } from 'src/app/domain/repositories/movement.repository';
import { MonthlyPeriodRepository } from 'src/app/domain/repositories/monthly-period.repository';
import { TimeProvider } from 'src/app/domain/services/time-provider';
import { inject, Inject, Injectable } from '@angular/core';
import {
  DEBT_REPOSITORY,
  MONTHLY_PERIOD_REPOSITORY,
  MOVEMENT_REPOSITORY,
} from 'src/app/core/providers/tokens';
import { SessionService } from 'src/app/core/session/session.service';
import { IdempotencyService } from 'src/app/core/services/idempotency.service';

@Injectable({ providedIn: 'root' })
export class PayDebtUseCase {
  private readonly session = inject(SessionService);

  private idempotency = inject(IdempotencyService);

  constructor(
    @Inject(DEBT_REPOSITORY)
    private readonly debtRepository: DebtRepository,
    @Inject(MOVEMENT_REPOSITORY)
    private readonly movementRepository: MovementRepository,
    @Inject(MONTHLY_PERIOD_REPOSITORY)
    private readonly periodRepository: MonthlyPeriodRepository,
    private readonly timeProvider: TimeProvider,
  ) {}

  async execute(debtId: string, key: string): Promise<void> {
    return this.idempotency.execute(key, async () => {
      // Obtener la deuda
      const debt = await this.debtRepository.findById(debtId);

      if (!debt) {
        throw new Error('La deuda no existe.');
      }

      const currentUserId = this.session.getUserId();

      if (!currentUserId) {
        throw new Error('Usuario no autenticado');
      }

      if (debt.getDebtorId() !== currentUserId) {
        throw new Error('Debt inválida');
      }

      // Validar estado
      if (debt.isPaid()) {
        throw new Error('La deuda ya está pagada.');
      }

      // Obtener período actual (mes del pago)
      const currentYearMonth = this.timeProvider.currentYearMonth();
      const period = await this.periodRepository.findById(
        currentYearMonth.toString(),
      );

      if (!period) {
        throw new Error('El período actual no existe.');
      }

      if (period.isClosed()) {
        throw new Error('No se puede pagar una deuda en un período cerrado.');
      }

      // Marcar deuda como pagada
      debt.markAsPaid();

      // Crear movimiento de pago
      const now = this.timeProvider.now();

      const paymentMovement = Movement.create({
        type: 'DEBT_PAYMENT',
        amountCLP: debt.getAmount(),
        currency: 'CLP',
        yearMonth: currentYearMonth,
        title: `Pago deuda ${debt.getDebtorName()}`,
        createdAt: now,
        debtId: debt.getId(),
      });

      // Persistir cambios
      try {
        if (!debt.getId()) {
          throw new Error('Debt sin ID no puede ser pagada');
        }

        await this.movementRepository.payDebt(paymentMovement, debt);
      } catch (error) {
        console.error('[PayDebtUseCase]', error);
        throw new Error('Error al pagar la deuda');
      }
    });
  }
}
