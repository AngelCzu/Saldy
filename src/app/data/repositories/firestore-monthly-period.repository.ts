import { getDoc, setDoc } from '@angular/fire/firestore';
import { MonthlyPeriodRepository } from 'src/app/domain/repositories/monthly-period.repository';
import { MonthlyPeriod } from 'src/app/domain/entities/monthly-period.entity';
import { FirestoreDatasource } from '../datasources/firestore.datasource';
import { YearMonth } from 'src/app/domain/value-objects/year-month.vo';
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class FirestoreMonthlyPeriodRepository
  implements MonthlyPeriodRepository {
  constructor(private readonly datasource: FirestoreDatasource) {}

  async findById(id: string): Promise<MonthlyPeriod | null> {
    const ref = this.datasource.userDoc(`periodos/${id}`);
    const snapshot = await getDoc(ref);

    if (!snapshot.exists()) return null;

    return MonthlyPeriod.restore(
      YearMonth.fromString(id),
      snapshot.data()['cerrado']
    );
  }

  async save(period: MonthlyPeriod): Promise<void> {
    const id = period.getYearMonth().toString();
    const ref = this.datasource.userDoc(`periodos/${id}`);

    await setDoc(ref, {
      cerrado: period.isClosed(),
    });
  }

}
