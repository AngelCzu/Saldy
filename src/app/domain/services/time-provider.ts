// Tiempo oficial del sistema (Receptor de fechas)

import { YearMonth } from '../value-objects/year-month.vo';

export abstract class TimeProvider {
  abstract now(): Date;

  currentYearMonth(): YearMonth {
    return YearMonth.fromDate(this.now());
  }
}
