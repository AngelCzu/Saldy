import { TimeProvider } from 'src/app/domain/services/time-provider';
import { YearMonth } from 'src/app/domain/value-objects/year-month.vo';
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class FirestoreTimeProvider extends TimeProvider {
  currentYearMonth(): YearMonth {
    const now = new Date();
    return YearMonth.create(now.getFullYear(), now.getMonth() + 1);
  }
}
