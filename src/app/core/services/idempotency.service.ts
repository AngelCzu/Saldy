import { Injectable } from '@angular/core';
import { FirestoreDatasource } from 'src/app/data/datasources/firestore.datasource';
import { doc, getDoc, setDoc, Timestamp } from '@angular/fire/firestore';
import { runTransaction } from '@angular/fire/firestore';

type IdempotencyRecord<T = any> = {
  status: 'processing' | 'completed';
  response?: T;
  createdAt: Timestamp;
};



@Injectable({ providedIn: 'root' })
export class IdempotencyService {

  constructor(private readonly ds: FirestoreDatasource) {}

async execute<T>(key: string, handler: () => Promise<T>): Promise<T> {

  const ref = this.ds.userDoc(`idempotency_keys/${key}`);

  const result = await runTransaction(this.ds.getFirestoreInstance(), async (tx) => {

    const snap = await tx.get(ref);

    if (snap.exists()) {
      const data = snap.data() as IdempotencyRecord<T>;

      if (data.status === 'completed') {
        return data.response as T;
      }

      throw new Error('Operación en proceso');
    }

    tx.set(ref, {
      status: 'processing',
      createdAt: Timestamp.now()
    });

    return null;
  });

  // si ya estaba completado
  if (result !== null) {
    return result;
  }

  try {
    const response = await handler();

    await setDoc(ref, {
      status: 'completed',
      createdAt: Timestamp.now()
    });

    return response;

  } catch (error) {
    throw error;
  }
}
}