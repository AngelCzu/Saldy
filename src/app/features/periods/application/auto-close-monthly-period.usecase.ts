import { MonthlyPeriod } from "src/app/domain/entities/monthly-period.entity";
import { MonthlyPeriodRepository } from "src/app/domain/repositories/monthly-period.repository";
import { DebtRepository } from "src/app/domain/repositories/debt.repository";
import { TimeProvider } from "src/app/domain/services/time-provider";
import { YearMonth } from "src/app/domain/value-objects/year-month.vo";

export interface AutoCloseResult {
  monthClosed: boolean;
  pendingDebtsCount: number;
}

export class AutoCloseMonthlyPeriodUseCase {
  constructor(
    private readonly periodRepository: MonthlyPeriodRepository,
    private readonly debtRepository: DebtRepository,
    private readonly timeProvider: TimeProvider
  ) {}

  async execute(): Promise<AutoCloseResult> {
    const current = this.timeProvider.currentYearMonth();
    const previous = current.previous();

    const previousPeriod =
      await this.periodRepository.findByYearMonth(previous);

    let monthClosed = false;

    if (previousPeriod && !previousPeriod.isClosed()) {
      previousPeriod.close();
      await this.periodRepository.save(previousPeriod);
      monthClosed = true;
    }

    const currentPeriod =
      await this.periodRepository.findByYearMonth(current);

    if (!currentPeriod) {
      await this.periodRepository.save(
        MonthlyPeriod.create(current)
      );
    }

    let pendingCount = 0;

    if (monthClosed) {
      pendingCount = await this.debtRepository.countPending();
    }

    return {
      monthClosed,
      pendingDebtsCount: pendingCount
    };
  }
}