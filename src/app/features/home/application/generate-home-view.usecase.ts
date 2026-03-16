import { Movement } from 'src/app/domain/entities/movement.entity';
import { Category } from 'src/app/domain/entities/category.entity';
import { CategoryRepository } from 'src/app/domain/repositories/category.repository';
import { ListMovementsUseCase } from 'src/app/features/movements/application/list-movements.usecase';
import { AutoCloseMonthlyPeriodUseCase } from 'src/app/features/periods/application/auto-close-monthly-period.usecase';
import { Injectable } from '@angular/core';

export interface CategoryDistribution {
  categoryId: string;
  name: string;
  color: string;
  amount: number;
  percentage: number;
}

export interface HomeSummary {
  movements: Movement[];
  totalIncome: number;
  totalExpense: number;
  balance: number;
  categories: CategoryDistribution[];
}

@Injectable({ providedIn: 'root' })
export class GenerateHomeViewUseCase {

  constructor(
    private readonly listMovements: ListMovementsUseCase,
    private readonly autoClose: AutoCloseMonthlyPeriodUseCase,
    private readonly categoryRepository: CategoryRepository
  ) {}

  async execute(): Promise<HomeSummary> {

    // asegura cierre automático del periodo si cambió el mes
    await this.autoClose.execute();

    const movements = await this.listMovements.execute();
    const categories = await this.categoryRepository.getAll();

    const summary = this.calculateSummary(movements, categories);

    return {
      movements,
      ...summary
    };
  }

  private calculateSummary(
    movements: Movement[],
    categories: Category[]
  ) {

    let totalIncome = 0;
    let totalExpense = 0;

    const categoryMap = new Map<string, number>();

    for (const movement of movements) {

      const amount = movement.getAmount();

      if (movement.isIncome()) {
        totalIncome += amount;
        continue;
      }

      if (movement.isExpense()) {

        totalExpense += amount;

        const categoryId = movement.getCategoryId();
        if (!categoryId) continue;

        const current = categoryMap.get(categoryId) ?? 0;

        categoryMap.set(categoryId, current + amount);
      }
    }

    const categoryIndex = new Map(
      categories.map(c => [c.getId(), c])
    );

    const result: CategoryDistribution[] = [];

    for (const [categoryId, amount] of categoryMap.entries()) {

      const category = categoryIndex.get(categoryId);

      if (!category) continue;

      result.push({
        categoryId,
        name: category.getName(),
        color: category.getColor(),
        amount,
        percentage: totalExpense
          ? Math.round((amount / totalExpense) * 100)
          : 0
      });
    }

    return {
      totalIncome,
      totalExpense,
      balance: totalIncome - totalExpense,
      categories: result
    };
  }


}
