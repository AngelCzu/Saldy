import { addDoc, collection, getDocs, orderBy, query, where } from '@angular/fire/firestore';
import { MovementRepository } from 'src/app/domain/repositories/movement.repository';
import { Movement } from 'src/app/domain/entities/movement.entity';
import { FirestoreDatasource } from '../datasources/firestore.datasource';
import { MovementMapper } from '../mappers/movement.mapper';
import { YearMonth } from 'src/app/domain/value-objects/year-month.vo';

export class FirestoreMovementRepository implements MovementRepository {
  constructor(
    private readonly datasource: FirestoreDatasource,
    private readonly userId: string
  ) {}

  async save(movement: Movement): Promise<string> {
    const ref = await addDoc(
      collection(this.datasource.db, `usuarios/${this.userId}/movimientos`),
      MovementMapper.toFirestore(movement)
    );

    return ref.id;
  }

  async findByPeriod(yearMonth: YearMonth): Promise<Movement[]> {
  const q = query(
    collection(this.datasource.db, `usuarios/${this.userId}/movimientos`),
    where('periodo', '==', yearMonth.toString()),
    orderBy('creadoEn', 'desc')
  );

  const snapshot = await getDocs(q);

  return snapshot.docs.map(doc =>
    MovementMapper.fromFirestore(doc.id, doc.data())
  );
}

}
