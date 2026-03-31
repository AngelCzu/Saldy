//Conexión FireBase

import { Injectable } from '@angular/core';
import { Firestore, collection, doc } from '@angular/fire/firestore';
import { Auth } from '@angular/fire/auth';

@Injectable({ providedIn: 'root' })
export class FirestoreDatasource {
  constructor(
    public readonly db: Firestore,
    private readonly auth: Auth
  ) {}

userCollection(path: string) {
  const userId = this.auth.currentUser?.uid;

  if (!userId) {
    throw new Error('Usuario no autenticado');
  }

  return collection(this.db, `usuarios/${userId}/${path}`);
}

userDoc(path: string) {
  const userId = this.auth.currentUser?.uid;

  if (!userId) {
    throw new Error('Usuario no autenticado');
  }

  return doc(this.db, `usuarios/${userId}/${path}`);
}

getFirestoreInstance() {
  return this.db;
}
}
