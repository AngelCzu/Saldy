import { addDoc, getDocs, orderBy, query, where } from '@angular/fire/firestore';
import { MovementRepository } from 'src/app/domain/repositories/movement.repository';
import { Movement } from 'src/app/domain/entities/movement.entity';
import { FirestoreDatasource } from '../datasources/firestore.datasource';
import { MovementDocument, MovementMapper } from '../mappers/movement.mapper';
import { YearMonth } from 'src/app/domain/value-objects/year-month.vo';
import { Injectable } from '@angular/core';

@Injectable()
export class FirestoreMovementRepository implements MovementRepository {
  
  constructor(private readonly datasource: FirestoreDatasource) {}

  async save(movement: Movement): Promise<string> {
    try {
      const ref = await addDoc(
        this.datasource.userCollection('movimientos'),
        MovementMapper.toFirestore(movement)
      );

      return ref.id;

    } catch (error) {
      console.error('[MovementRepository] Error saving movement', error);

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
        console.error('[MovementRepository] Error fetching movements', error);
        throw new Error('No se pudieron obtener los movimientos');
      }
    }

}
