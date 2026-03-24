import { TimeProvider } from 'src/app/domain/services/time-provider';
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class FirestoreTimeProvider extends TimeProvider {

  override now(): Date {
    return new Date();
  }

}