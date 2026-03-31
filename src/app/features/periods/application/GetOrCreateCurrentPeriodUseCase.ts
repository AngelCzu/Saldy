import { Inject, Injectable } from "@angular/core";
import { MONTHLY_PERIOD_REPOSITORY } from "src/app/core/providers/tokens";
import { MonthlyPeriod } from "src/app/domain/entities/monthly-period.entity";
import { MonthlyPeriodRepository } from "src/app/domain/repositories/monthly-period.repository";
import { TimeProvider } from "src/app/domain/services/time-provider";
import { YearMonth } from "src/app/domain/value-objects/year-month.vo";


@Injectable({ providedIn: 'root' })
export class GetOrCreateCurrentPeriodUseCase {

    constructor(
        @Inject(MONTHLY_PERIOD_REPOSITORY)
        private readonly repository: MonthlyPeriodRepository,
        private readonly timeProvider: TimeProvider
    ) {}

  async execute(): Promise<MonthlyPeriod> {

    const yearMonth = this.timeProvider.currentYearMonth();

    const id = yearMonth.toString();

    let period = await this.repository.findById(id);

    if (!period) {
      period = MonthlyPeriod.create(yearMonth);
      await this.repository.save(period);
    }

    return period;
  }
}