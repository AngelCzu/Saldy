import { MonthlyPeriod } from "src/app/domain/entities/monthly-period.entity";
import { DebtRepository } from "src/app/domain/repositories/debt.repository";
import { MonthlyPeriodRepository } from "src/app/domain/repositories/monthly-period.repository";
import { YearMonth } from "src/app/domain/value-objects/year-month.vo";

export interface CloseMonthResult {
  hadPendingDebts: boolean;
  pendingDebtsCount: number;
}

export class CloseMonthlyPeriodUseCase {
  constructor(
    private readonly periodRepository: MonthlyPeriodRepository,
    private readonly debtRepository: DebtRepository
  ) {}

  async execute(yearMonth: YearMonth): Promise<CloseMonthResult> {
    const period = await this.periodRepository.findByYearMonth(yearMonth);

    if (!period) {
      throw new Error('El período no existe.');
    }

    if (period.isClosed()) {
      throw new Error('El período ya está cerrado.');
    }

    // Verificar deudas pendientes
    const pendingCount = await this.debtRepository.countPending();

    const hadPending = pendingCount > 0;

    // Cerrar período
    period.close();
    await this.periodRepository.save(period);

    // Crear siguiente
    const next = yearMonth.next();
    const nextPeriod = await this.periodRepository.findByYearMonth(next);

    if (!nextPeriod) {
      const created = MonthlyPeriod.create(next);
      await this.periodRepository.save(created);
    }

    return {
      hadPendingDebts: hadPending,
      pendingDebtsCount: pendingCount
    };
  }
}