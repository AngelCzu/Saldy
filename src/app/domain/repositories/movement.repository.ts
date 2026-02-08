// Acceso a movimientos financieros

import { Movement } from '../entities/movement.entity';
import { YearMonth } from '../value-objects/year-month.vo';

export interface MovementRepository {
  save(movement: Movement): Promise<string>;
  findByPeriod(yearMonth: YearMonth): Promise<Movement[]>;

}
