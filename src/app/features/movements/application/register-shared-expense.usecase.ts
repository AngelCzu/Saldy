import { inject, Injectable } from '@angular/core';
import { Debt } from 'src/app/domain/entities/debt.entity';
import { DebtRepository } from 'src/app/domain/repositories/debt.repository';
import { RegisterMovementCommand, RegisterMovementUseCase } from './register-movement.usecase';
import { DEBT_REPOSITORY } from 'src/app/core/providers/tokens';

@Injectable({ providedIn: 'root' })
export class RegisterSharedExpenseUseCase {

  private readonly registerMovementUseCase = inject(RegisterMovementUseCase);
  private readonly debtRepository = inject<DebtRepository>(DEBT_REPOSITORY);

  async execute(params: {
    movement: RegisterMovementCommand;
    participants: {
      name: string;
      amount: number;
    }[];
  }): Promise<void> {

      // Validar que la sumas coincidan con los gastos
      const total = this.extractTotal(params.movement);
      const totalParticipants = params.participants.reduce(
        (sum, p) => sum + p.amount,
        0
      );

      if (!params.participants || params.participants.length === 0) {
        throw new Error('Debe haber al menos un participante');
      }

      if (totalParticipants !== total) {
        throw new Error('La suma de participantes no coincide con el total del gasto');
      }

      if (params.participants.some(p => p.amount <= 0)) {
        throw new Error('Los montos deben ser mayores a 0');
      }

      // Crear movimiento usando el flujo correcto
      const movementId = await this.registerMovementUseCase.execute(params.movement);

      // Crear deudas
      const debts = params.participants.map(p =>
        Debt.create({
          movementId,
          debtorName: p.name,
          amount: p.amount,
        })
      );

      await Promise.all(debts.map(d => this.debtRepository.save(d)));
    }

    private extractTotal(command: RegisterMovementCommand): number {
    if (command.currency === 'CLP') {
      return command.amountCLP;
    }

    // UF → convertir a CLP igual que el dominio
    return Math.round(command.inputAmount * command.ufValue);

  }

}