// Marcar como deuda pagada 

import { DebtRepository } from 'src/app/domain/repositories/debt.repository';
import { Movement } from 'src/app/domain/entities/movement.entity';
import { YearMonth } from 'src/app/domain/value-objects/year-month.vo'; 
import { Debt } from 'src/app/domain/entities/debt.entity';
import { MovementRepository } from 'src/app/domain/repositories/movement.repository';
import { MonthlyPeriodRepository } from 'src/app/domain/repositories/monthly-period.repository';
import { TimeProvider } from 'src/app/domain/services/time-provider';

export class PayDebtUseCase {
  constructor(
    private readonly debtRepository: DebtRepository,
    private readonly movementRepository: MovementRepository,
    private readonly periodRepository: MonthlyPeriodRepository,
    private readonly timeProvider: TimeProvider
  ) {

    //Test

  }

  async execute(debtId: string): Promise<void> {
    // Obtener la deuda
    const debt = await this.debtRepository.findById(debtId);

    if (!debt) {
      throw new Error('La deuda no existe.');
    }

    // Validar estado
    if (debt.isPaid()) {
      throw new Error('La deuda ya está pagada.');
    }

    // Obtener período actual (mes del pago)
    const currentYearMonth = this.timeProvider.currentYearMonth();

    const period = await this.periodRepository.findByYearMonth(currentYearMonth);

    if (!period) {
      throw new Error('El período actual no existe.');
    }

    if (period.isClosed()) {
      throw new Error('No se puede pagar una deuda en un período cerrado.');
    }

    // Marcar deuda como pagada
    debt.markAsPaid();

    // Crear movimiento de pago
    const paymentMovement = Movement.create({
      type: 'DEBT_PAYMENT',
      amount: debt.getAmount(),
      yearMonth: currentYearMonth,
      description: `Pago deuda ${debt.getDebtorName()}`,
      debtId: debt.getId(),
    });

    // Persistir cambios
    await this.movementRepository.save(paymentMovement);
    await this.debtRepository.save(debt);
  }
}
