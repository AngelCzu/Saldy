// Tiempo oficial del sistema (Receptor de fechas)

import { YearMonth } from '../value-objects/year-month.vo';

export interface TimeProvider {
  currentYearMonth(): YearMonth;
}
