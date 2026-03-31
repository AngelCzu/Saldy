import { collection, doc, getDoc, setDoc, writeBatch } from '@angular/fire/firestore';
import { getDocs, query, where } from '@angular/fire/firestore';
import { DebtRepository } from 'src/app/domain/repositories/debt.repository';
import { Debt } from 'src/app/domain/entities/debt.entity';
import { FirestoreDatasource } from '../datasources/firestore.datasource';
import { DebtMapper } from '../mappers/debt.mapper';
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class FirestoreDebtRepository implements DebtRepository {
  constructor(private readonly datasource: FirestoreDatasource) {}

  async findById(id: string): Promise<Debt | null> {
    const ref = this.datasource.userDoc(`deudas/${id}`);

    const snapshot = await getDoc(ref);

    if (!snapshot.exists()) return null;

    return DebtMapper.fromFirestore(snapshot.id, snapshot.data());
  }

  async save(debt: Debt): Promise<void> {
    const ref = debt.getId()
      ? this.datasource.userDoc(`deudas/${debt.getId()}`)
      : doc(this.datasource.userCollection('deudas'));

    await setDoc(ref, DebtMapper.toFirestore(debt));
  }

  async countPending(): Promise<number> {
    const q = query(
      this.datasource.userCollection('deudas'),
      where('status', '==', 'pending')
    );

    const snapshot = await getDocs(q);
    return snapshot.size;
  }

  async saveMany(debts: Debt[]): Promise<void> {
    if (!debts.length) return;
    
    const batch = writeBatch(this.datasource.getFirestoreInstance());

    debts.forEach(debt => {
      const ref = doc(this.datasource.userCollection('deudas'));
      batch.set(ref, DebtMapper.toFirestore(debt));
    });

    await batch.commit();
  }

}
