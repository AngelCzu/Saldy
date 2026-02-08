import { doc, getDoc, setDoc } from '@angular/fire/firestore';
import { MonthlyPeriodRepository } from 'src/app/domain/repositories/monthly-period.repository';
import { MonthlyPeriod } from 'src/app/domain/entities/monthly-period.entity';
import { FirestoreDatasource } from '../datasources/firestore.datasource';
import { YearMonth } from 'src/app/domain/value-objects/year-month.vo';

export class FirestoreMonthlyPeriodRepository
  implements MonthlyPeriodRepository {
  constructor(
    private readonly datasource: FirestoreDatasource,
    private readonly userId: string
  ) {}

  async findByYearMonth(
    yearMonth: YearMonth
  ): Promise<MonthlyPeriod | null> {
    const id = yearMonth.toString();
    const ref = doc(
      this.datasource.db,
      `usuarios/${this.userId}/periodos/${id}`
    );

    const snapshot = await getDoc(ref);

    if (!snapshot.exists()) return null;

    return MonthlyPeriod.restore(
      yearMonth,
      snapshot.data()['cerrado']
    );
  }

  async save(period: MonthlyPeriod): Promise<void> {
  const id = period.getYearMonth().toString();

  const ref = doc(
    this.datasource.db,
    `usuarios/${this.userId}/periodos/${id}`
  );

  await setDoc(ref, {
    cerrado: period.isClosed(),
  });
}

}
