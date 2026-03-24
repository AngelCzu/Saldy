import { Injectable, inject } from '@angular/core';
import { RegisterMovementUseCase } from './register-movement.usecase';
import { buildMovementCommand } from '../adapters/movement-command.adapter';

interface RegisterMovementInput {
  type: 'income' | 'expense';
  title: string;
  categoryId?: string;
  currency: 'clp' | 'uf';
  amount: number;
  ufValue?: number;
}

@Injectable({ providedIn: 'root' })
export class RegisterMovementFacade {

  private registerMovement = inject(RegisterMovementUseCase);

  async submit(input: RegisterMovementInput): Promise<string> {

    const command = buildMovementCommand({
      type: input.type,
      title: input.title,
      categoryId: input.categoryId,
      currency: input.currency,
      amount: input.amount,
      ufValue: input.ufValue,
    });

    return this.registerMovement.execute(command);
  }
}