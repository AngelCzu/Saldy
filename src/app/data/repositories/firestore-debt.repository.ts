import { collection, doc, getDoc, setDoc } from '@angular/fire/firestore';
import { DebtRepository } from 'src/app/domain/repositories/debt.repository';
import { Debt } from 'src/app/domain/entities/debt.entity';
import { FirestoreDatasource } from '../datasources/firestore.datasource';
import { DebtMapper } from '../mappers/debt.mapper';

export class FirestoreDebtRepository implements DebtRepository {
  constructor(
    private readonly datasource: FirestoreDatasource,
    private readonly userId: string
  ) {}

  async findById(id: string): Promise<Debt | null> {
    const ref = doc(
      this.datasource.db,
      `usuarios/${this.userId}/deudas/${id}`
    );

    const snapshot = await getDoc(ref);

    if (!snapshot.exists()) return null;

    return DebtMapper.fromFirestore(snapshot.id, snapshot.data());
  }

  async save(debt: Debt): Promise<void> {
    const ref = debt.getId()
      ? doc(this.datasource.db, `usuarios/${this.userId}/deudas/${debt.getId()}`)
      : doc(collection(this.datasource.db, `usuarios/${this.userId}/deudas`));

    await setDoc(ref, DebtMapper.toFirestore(debt));
  }
}
