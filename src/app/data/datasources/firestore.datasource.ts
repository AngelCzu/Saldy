//Conexión FireBase

import { Firestore } from '@angular/fire/firestore';

export class FirestoreDatasource {
  constructor(public readonly db: Firestore) {}
}
