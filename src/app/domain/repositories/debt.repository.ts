// Acceso a deudas

import { Debt } from '../entities/debt.entity';

export interface DebtRepository {
  findById(id: string): Promise<Debt | null>;
  save(debt: Debt): Promise<void>;
}
