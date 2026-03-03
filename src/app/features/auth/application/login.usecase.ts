import { inject, Injectable } from '@angular/core';
import { AuthRepository } from 'src/app/domain/repositories/auth.repository';
import { AUTH_REPOSITORY } from'src/app/core/providers/tokens';

@Injectable({ providedIn: 'root' })
export class LoginUseCase {

  private authRepository = inject<AuthRepository>(AUTH_REPOSITORY);

  async execute(email: string, password: string): Promise<void> {
    if (!email || !password) {
      throw new Error('Credenciales inválidas');
    }

    await this.authRepository.login(email, password);
  }
}
