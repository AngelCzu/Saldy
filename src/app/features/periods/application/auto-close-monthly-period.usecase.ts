import { MonthlyPeriod } from "src/app/domain/entities/monthly-period.entity";
import { MonthlyPeriodRepository } from "src/app/domain/repositories/monthly-period.repository";
import { DebtRepository } from "src/app/domain/repositories/debt.repository";
import { TimeProvider } from "src/app/domain/services/time-provider";
import { Inject, Injectable } from "@angular/core";
import { DEBT_REPOSITORY, MONTHLY_PERIOD_REPOSITORY } from "src/app/core/providers/tokens";

export interface AutoCloseResult {
  monthClosed: boolean;
  pendingDebtsCount: number;
}

@Injectable({ providedIn: 'root' })
export class AutoCloseMonthlyPeriodUseCase {
  constructor(
    @Inject(MONTHLY_PERIOD_REPOSITORY)
    private readonly periodRepository: MonthlyPeriodRepository,
    @Inject(DEBT_REPOSITORY)
    private readonly debtRepository: DebtRepository,
    private readonly timeProvider: TimeProvider
  ) {}

  async execute(): Promise<AutoCloseResult> {
    const current = this.timeProvider.currentYearMonth();
    const previous = current.previous();

    const previousId = previous.toString();

    const previousPeriod =
      await this.periodRepository.findById(previousId);

    let monthClosed = false;

    if (previousPeriod && !previousPeriod.isClosed()) {
      previousPeriod.close();
      await this.periodRepository.save(previousPeriod);
      monthClosed = true;
    }

    const currentId = current.toString();

    const currentPeriod =
      await this.periodRepository.findById(currentId);
      
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
