import { Injectable, inject } from '@angular/core';
import { RegisterMovementUseCase } from './register-movement.usecase';
import { buildMovementCommand } from '../adapters/movement-command.adapter';
import { RegisterSharedExpenseUseCase } from './register-shared-expense.usecase';
import { SubmitMovementData } from '../models/submit-movement.model';
import { CurrencyService } from 'src/app/core/services/currency.service';


@Injectable({ providedIn: 'root' })
export class RegisterMovementFacade {

  private registerMovement = inject(RegisterMovementUseCase);
  private registerShared = inject(RegisterSharedExpenseUseCase);
  private currencyService = inject(CurrencyService);

  async submitMovement(data: SubmitMovementData): Promise<void> {
    const key = crypto.randomUUID();
    // Obtener UF REAL solo si es necesario
    const ufValue =
      data.currency === 'uf'
        ? await this.currencyService.getUF()
        : undefined;

    const command = buildMovementCommand({
      type: data.type,
      title: data.title,
      categoryId: data.categoryId,
      currency: data.currency,
      amount: data.amount,
      ufValue,
      isShared: data.isShared
    });

    if (data.isShared && data.sharedData) {
      return this.registerShared.execute({
        movement: command,
        sharedData: data.sharedData
      }, key);
    }

    await this.registerMovement.execute(command, key);
  }

}