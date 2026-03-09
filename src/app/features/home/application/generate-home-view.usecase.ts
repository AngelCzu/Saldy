import { Movement } from 'src/app/domain/entities/movement.entity';
import { ListMovementsUseCase } from 'src/app/features/movements/application/list-movements.usecase';
import { AutoCloseMonthlyPeriodUseCase } from 'src/app/features/periods/application/auto-close-monthly-period.usecase';
import { Injectable } from '@angular/core';

export interface HomeSummary {
  hasMovements: boolean;
  movements: Movement[];
  totalIncome: number;
  totalExpense: number;
  balance: number;
  categoryDistribution: Record<string, number>;
}



@Injectable({ providedIn: 'root' })
export class GenerateHomeViewUseCase {

  constructor(
    private readonly listMovements: ListMovementsUseCase,
    private readonly autoClose: AutoCloseMonthlyPeriodUseCase
  ) {}

  async execute(): Promise<HomeSummary> {

    // asegura cierre automático del periodo si cambió el mes
    await this.autoClose.execute();

    const movements = await this.listMovements.execute();

    let totalIncome = 0;
    let totalExpense = 0;

    const categoryDistribution: Record<string, number> = {};

    for (const movement of movements) {

      const amount = movement.getAmount();

      if (movement.isIncome()) {
        totalIncome += amount;
        continue;
      }

      if (movement.isExpense()) {

        totalExpense += amount;

        const category = movement.getCategory() ?? 'OTROS';

        categoryDistribution[category] =
          (categoryDistribution[category] ?? 0) + amount;
      }
    }

    const balance = totalIncome - totalExpense;

    return {
      hasMovements: movements.length > 0,
      movements,
      totalIncome,
      totalExpense,
      balance,
      categoryDistribution
    };
  }
}