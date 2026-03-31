import { addDoc, doc, getDocs, orderBy, query, where, writeBatch } from '@angular/fire/firestore';
import { MovementRepository } from 'src/app/domain/repositories/movement.repository';
import { Movement } from 'src/app/domain/entities/movement.entity';
import { FirestoreDatasource } from '../datasources/firestore.datasource';
import { MovementDocument, MovementMapper } from '../mappers/movement.mapper';
import { YearMonth } from 'src/app/domain/value-objects/year-month.vo';
import { inject, Injectable } from '@angular/core';
import { Debt } from 'src/app/domain/entities/debt.entity';
import { DebtMapper } from '../mappers/debt.mapper';
import { LoggerService } from 'src/app/core/services/logger.service';

@Injectable()
export class FirestoreMovementRepository implements MovementRepository {
    

  private readonly logger = inject(LoggerService);

  
  constructor(private readonly datasource: FirestoreDatasource) {}

  async save(movement: Movement): Promise<string> {
    try {
      const ref = await addDoc(
        this.datasource.userCollection('movimientos'),
        MovementMapper.toFirestore(movement)
      );

      return ref.id;

    } catch (error) {
      this.logger.error('MovementRepository.save', error);

      throw new Error('No se pudo guardar el movimiento.');
    }
  }

  async findByPeriod(yearMonth: YearMonth): Promise<Movement[]> {
    const q = query(
      this.datasource.userCollection('movimientos'),
      where('yearMonth', '==', yearMonth.toString()),
      orderBy('createdAt', 'desc')
    );

    try {
      const snapshot = await getDocs(q);

      return snapshot.docs.map(doc => {
        const data = doc.data() as MovementDocument;

        return MovementMapper.fromFirestore(doc.id, data);
      });

    } catch (error) {
        this.logger.error('MovementRepository.findByPeriod', error);
        throw new Error('No se pudieron obtener los movimientos');
      }
    }

  async saveSharedExpense(
    movement: Movement,
    buildDebts: (movementId: string) => Debt[]
  ): Promise<string> {

    const batch = writeBatch(this.datasource.getFirestoreInstance());

    // Crear referencia del movement
    const movementRef = doc(this.datasource.userCollection('movimientos'));

    // Guardar movement
    batch.set(movementRef, MovementMapper.toFirestore(movement));

    // Crear debts con el ID real del movement
    const debts = buildDebts(movementRef.id);

    // Guardar debts
    debts.forEach(debt => {
      const debtRef = doc(this.datasource.userCollection('deudas'));
      batch.set(debtRef, DebtMapper.toFirestore(debt));
    });

    // Commit atómico
    try {
      await batch.commit();
      return movementRef.id;
    } catch (error) {
      this.logger.error('MovementRepository.saveSharedExpense', error);
      throw new Error('No se pudo guardar el gasto compartido');
    }
  }

  async payDebt(
    paymentMovement: Movement,
    debt: Debt
  ): Promise<void> {

    const batch = writeBatch(this.datasource.getFirestoreInstance());

    // movement
    const movementRef = doc(this.datasource.userCollection('movimientos'));
    batch.set(movementRef, MovementMapper.toFirestore(paymentMovement));

    // debt (update)

    const debtId = debt.getId();

    if (!debtId) {
      throw new Error('Debt sin ID en repository');
    }

    const debtRef = this.datasource.userDoc(`deudas/${debtId}`);

    batch.update(debtRef, DebtMapper.toFirestore(debt));

    try {
      await batch.commit();
    } catch (error) {
      this.logger.error('MovementRepository.payDebt', error);
      throw new Error('No se pudo pagar la deuda');
    }
  }
}
