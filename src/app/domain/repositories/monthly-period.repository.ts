// Estado Financiero de un mes

import { MonthlyPeriod } from '../entities/monthly-period.entity';
import { YearMonth } from '../value-objects/year-month.vo';

export interface MonthlyPeriodRepository {
  findById(id: string): Promise<MonthlyPeriod | null>;
  save(period: MonthlyPeriod): Promise<void>;
}
