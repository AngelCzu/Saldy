import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class LoggerService {

  error(context: string, error: unknown) {
    console.error(`[${context}]`, error);
  }

  info(context: string, message: string) {
    console.log(`[${context}] ${message}`);
  }
}