import { inject } from '@angular/core';
import { Auth, signInWithEmailAndPassword, signOut } from '@angular/fire/auth';
import { AuthRepository } from 'src/app/domain/repositories/auth.repository';

export class FirebaseAuthRepository implements AuthRepository {

  private auth = inject(Auth);

  async login(email: string, password: string): Promise<void> {
    await signInWithEmailAndPassword(this.auth, email, password);
  }

  async logout(): Promise<void> {
    await signOut(this.auth);
  }

  async getCurrentUserId(): Promise<string | null> {
    return this.auth.currentUser?.uid ?? null;
  }
}