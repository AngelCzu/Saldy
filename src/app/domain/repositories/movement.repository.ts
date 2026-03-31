// Acceso a movimientos financieros

import { Debt } from '../entities/debt.entity';
import { Movement } from '../entities/movement.entity';
import { YearMonth } from '../value-objects/year-month.vo';

export interface MovementRepository {
  save(movement: Movement): Promise<string>;
  findByPeriod(yearMonth: YearMonth): Promise<Movement[]>;
  saveSharedExpense(movement: Movement,buildDebts: (movementId: string) => Debt[]): Promise<string>;
  payDebt(paymentMovement: Movement, debt: Debt): Promise<void>;
}
