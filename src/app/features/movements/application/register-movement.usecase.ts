import { Inject, Injectable } from '@angular/core';
import { MovementRepository } from 'src/app/domain/repositories/movement.repository';
import { Movement } from 'src/app/domain/entities/movement.entity';
import { YearMonth } from 'src/app/domain/value-objects/year-month.vo';
import { TimeProvider } from 'src/app/domain/services/time-provider';
import { MONTHLY_PERIOD_REPOSITORY, MOVEMENT_REPOSITORY } from 'src/app/core/providers/tokens';
import { MonthlyPeriodRepository } from 'src/app/domain/repositories/monthly-period.repository';
import { MonthlyPeriod } from 'src/app/domain/entities/monthly-period.entity';
import { MovementType } from 'src/app/domain/entities/movement.entity';

type BaseCommand = {
  type: MovementType;
  title: string;
  categoryId?: string;
};

type CLPCommand = {
  currency: 'CLP';
  amountCLP: number;
  inputAmount?: never;
  ufValue?: never;
};

type UFCommand = {
  currency: 'UF';
  inputAmount: number;
  ufValue: number;
  amountCLP?: never;
};

export type RegisterMovementCommand = BaseCommand & (CLPCommand | UFCommand);

@Injectable({ providedIn: 'root' })
export class RegisterMovementUseCase {

  constructor(
    @Inject(MOVEMENT_REPOSITORY)
    private readonly repository: MovementRepository,

    @Inject(MONTHLY_PERIOD_REPOSITORY)
    private readonly periodRepository: MonthlyPeriodRepository,

    private readonly timeProvider: TimeProvider
  ) {}

  async execute(command: RegisterMovementCommand): Promise<string> {
    try {
      this.validateCommand(command);

      const now = this.timeProvider.now();
      const yearMonth = YearMonth.fromDate(now);

      const period = await this.getOrCreatePeriod(yearMonth);

      this.ensurePeriodIsOpen(period);

      const movement = this.buildMovement(command, now, yearMonth);

      return await this.repository.save(movement);

    } catch (error) {
      console.error('[RegisterMovementUseCase] Error', error);
      throw error;
    }
  }

  // ======================
  // PRIVATE METHODS
  // ======================

  private async getOrCreatePeriod(yearMonth: YearMonth): Promise<MonthlyPeriod> {
    const id = yearMonth.toString();

    let period = await this.periodRepository.findById(id);

    if (!period) {
      period = MonthlyPeriod.create(yearMonth);
      await this.periodRepository.save(period);
    }

    return period;
  }

  private ensurePeriodIsOpen(period: MonthlyPeriod): void {
    if (period.isClosed()) {
      throw new Error('El período está cerrado.');
    }
  }

  private buildMovement(
    command: RegisterMovementCommand,
    now: Date,
    yearMonth: YearMonth
  ): Movement {
    return Movement.createFromCommand({
      ...command,
      yearMonth,
      createdAt: now
    });
  }


  // ======================
  // VALIDATORS
  // ======================

  private validateCommand(command: RegisterMovementCommand): void {
  if (!command.title || command.title.trim().length === 0) {
    throw new Error('El título es obligatorio');
  }

  if (command.currency === 'CLP' && !Number.isFinite(command.amountCLP)) {
    throw new Error('amountCLP inválido');
  }

  if (command.currency === 'UF') {
    if (!command.inputAmount || !command.ufValue) {
      throw new Error('Datos UF incompletos');
    }
  }
}

}

