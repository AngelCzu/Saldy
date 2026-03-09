//Conexión FireBase

import { Injectable } from '@angular/core';
import { Firestore, collection, doc } from '@angular/fire/firestore';
import { SessionService } from 'src/app/core/session/session.service';

@Injectable({ providedIn: 'root' })
export class FirestoreDatasource {
  constructor(
    public readonly db: Firestore,
    private readonly session: SessionService
  ) {}

  userCollection(path: string) {
    const userId = this.session.getUserId();
    return collection(this.db, `usuarios/${userId}/${path}`);
  }

  userDoc(path: string) {
    const userId = this.session.getUserId();
    return doc(this.db, `usuarios/${userId}/${path}`);
  }
}
