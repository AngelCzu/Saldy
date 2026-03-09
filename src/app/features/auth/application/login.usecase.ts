import { Inject, Injectable } from '@angular/core';
import { AuthRepository } from 'src/app/domain/repositories/auth.repository';
import { AUTH_REPOSITORY } from'src/app/core/providers/tokens';

@Injectable({ providedIn: 'root' })
export class LoginUseCase {
  constructor(
    @Inject(AUTH_REPOSITORY)
    private readonly authRepository: AuthRepository
  ) {}

  async execute(email: string, password: string): Promise<void> {
    if (!email || !password) {
      throw new Error('Credenciales inválidas');
    }

    await this.authRepository.login(email, password);
  }
}
