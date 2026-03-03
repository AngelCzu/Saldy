import { Movement } from 'src/app/domain/entities/movement.entity';
import { ListMovementsUseCase } from 'src/app/features/movements/application/list-movements.usecase';
import { AutoCloseMonthlyPeriodUseCase } from 'src/app/features/periods/application/auto-close-monthly-period.usecase';

export interface HomeSummary {
  movements: Movement[];
  totalIncome: number;
  totalExpense: number;
  balance: number;
  categoryDistribution: Record<string, number>;
}

export class GenerateHomeViewUseCase {

  constructor(
    private readonly listMovements: ListMovementsUseCase,
    private readonly autoClose: AutoCloseMonthlyPeriodUseCase
  ) {}

    async execute(): Promise<HomeSummary> {

    await this.autoClose.execute();

    const movements = await this.listMovements.execute();

    const totalIncome = movements
        .filter(m => m.isIncome())
        .reduce((acc, m) => acc + m.getAmount(), 0);

    const totalExpense = movements
        .filter(m => m.isExpense())
        .reduce((acc, m) => acc + m.getAmount(), 0);

    const balance = totalIncome - totalExpense;

    const categoryDistribution: Record<string, number> = {};

    for (const movement of movements) {
        if (movement.isExpense()) {
        const category = movement.getCategory() ?? 'OTROS';

        categoryDistribution[category] =
            (categoryDistribution[category] ?? 0) + movement.getAmount();
        }
    }

    return {
        movements,
        totalIncome,
        totalExpense,
        balance,
        categoryDistribution
    };
    }
}