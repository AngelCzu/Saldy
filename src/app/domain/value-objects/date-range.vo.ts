import { YearMonth } from './year-month.vo';

export class DateRange {

  constructor(
    public readonly from: YearMonth,
    public readonly to: YearMonth
  ) {
    if (from.isAfter(to)) {
      throw new Error('DateRange inválido: "from" debe ser menor o igual a "to"');
    }
  }

  contains(month: YearMonth): boolean {
    return month.isAfterOrEqual(this.from) &&
           month.isBeforeOrEqual(this.to);
  }

  getMonthCount(): number {
    return this.from.diffInMonths(this.to) + 1;
  }

  exceeds(limit: number): boolean {
    return this.getMonthCount() > limit;
  }
}
