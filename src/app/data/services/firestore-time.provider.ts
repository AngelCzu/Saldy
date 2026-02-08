import { TimeProvider } from 'src/app/domain/services/time-provider';
import { YearMonth } from 'src/app/domain/value-objects/year-month.vo';

export class FirestoreTimeProvider implements TimeProvider {
  currentYearMonth(): YearMonth {
    const now = new Date();
    return YearMonth.create(now.getFullYear(), now.getMonth() + 1);
  }
}
