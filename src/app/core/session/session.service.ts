// Sesion de usuarios 

import { Injectable } from '@angular/core';
import { Auth, onAuthStateChanged, User } from '@angular/fire/auth';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SessionService {
  private _user = new BehaviorSubject<User | null>(null);
  private _authInitialized = new BehaviorSubject<boolean>(false);

  readonly user$ = this._user.asObservable();
  readonly authInitialized$ = this._authInitialized.asObservable();

  constructor(private auth: Auth) {

    onAuthStateChanged(this.auth, (user) => {
      this._user.next(user);
      this._authInitialized.next(true);
    });

  }

  get currentUser(): User | null {
    return this._user.value;
  }

  getUserId(): string {
    const user = this.currentUser;
    if (!user) {
      throw new Error('No hay sesión activa');
    }
    return user.uid;
  }

  isAuthenticated(): boolean {
    return this.currentUser !== null;
  }

  logout(): Promise<void> {
    return this.auth.signOut();
  }



}
