// Sesion de usuarios 

import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class SessionService {
  private userId: string | null = null;

  setUserId(userId: string): void {
    this.userId = userId;
  }

  getUserId(): string {
    if (!this.userId) {
      throw new Error('No hay sesión activa');
    }
    return this.userId;
  }

  isAuthenticated(): boolean {
    return this.userId !== null;
  }

  clear(): void {
    this.userId = null;
  }
}
