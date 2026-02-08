// Movimientos 

import { YearMonth } from '../value-objects/year-month.vo';

export type MovementType =
  | 'INCOME'                 // Ingreso
  | 'EXPENSE'                // Gastos
  | 'GOAL_CONTRIBUTION'      // Metas
  | 'DEBT_PAYMENT';          // Pagos de deudas

export class Movement {
  private readonly id?: string;
  private readonly type: MovementType;
  private readonly amount: number;
  private readonly yearMonth: YearMonth;
  private readonly description: string;

  // Metadatos
  private readonly category?: string;
  private readonly frequency?: 'UNICA' | 'MENSUAL';
  private readonly isShared?: boolean;
  private readonly goalId?: string;
  private readonly debtId?: string;

  private constructor(params: {
    id?: string;
    type: MovementType;
    amount: number;
    yearMonth: YearMonth;
    description: string;
    category?: string;
    frequency?: 'UNICA' | 'MENSUAL';
    isShared?: boolean;
    goalId?: string;
    debtId?: string;
  }) {
    this.validateAmount(params.amount);
    this.validateDescription(params.description);
    this.validateMetadata(params);

    this.id = params.id;
    this.type = params.type;
    this.amount = params.amount;
    this.yearMonth = params.yearMonth;
    this.description = params.description;
    this.category = params.category;
    this.frequency = params.frequency;
    this.isShared = params.isShared;
    this.goalId = params.goalId;
    this.debtId = params.debtId;
  }


  // Crear movimiento nuevo (aún no persistido)
  static create(params: {
    type: MovementType;
    amount: number;
    yearMonth: YearMonth;
    description: string;
    category?: string;
    frequency?: 'UNICA' | 'MENSUAL';
    isShared?: boolean;
    goalId?: string;
    debtId?: string;
  }): Movement {
    return new Movement(params);
  }

  // Restaurar movimiento desde Firestore 
  static restore(params: {
    id: string;
    type: MovementType;
    amount: number;
    yearMonth: YearMonth;
    description: string;
    category?: string;
    frequency?: 'UNICA' | 'MENSUAL';
    isShared?: boolean;
    goalId?: string;
    debtId?: string;
  }): Movement {
    return new Movement(params);
  }




  // ======================
  // GETTERS
  // ======================

  getId(): string | undefined {
    return this.id;
  }

  getType(): MovementType {
    return this.type;
  }

  getAmount(): number {
    return this.amount;
  }

  getYearMonth(): YearMonth {
    return this.yearMonth;
  }

  getPeriod(): string {
    return this.yearMonth.toString();
  }


  getDescription(): string {
    return this.description;
  }

  getCategory(): string | undefined {
    return this.category;
  }

  isExpense(): boolean {
    return this.type === 'EXPENSE';
  }

  isIncome(): boolean {
    return this.type === 'INCOME';
  }

  isGoalContribution(): boolean {
    return this.type === 'GOAL_CONTRIBUTION';
  }

  isDebtPayment(): boolean {
    return this.type === 'DEBT_PAYMENT';
  }




  
  // ======================
  // VALIDACIONES
  // ======================

  private validateAmount(amount: number): void {
    if (!Number.isFinite(amount) || amount <= 0) {
      throw new Error('El monto debe ser mayor a 0.');
    }
  }

  private validateDescription(description: string): void {
    if (!description || description.trim().length === 0) {
      throw new Error('La descripción es obligatoria.');
    }
  }

  private validateMetadata(params: {
    type: MovementType;
    category?: string;
    goalId?: string;
    debtId?: string;
    isShared?: boolean;
  }): void {
    if (params.type === 'EXPENSE') {
      if (!params.category) {
        throw new Error('Un gasto debe tener categoría.');
      }
    }

    if (params.type === 'GOAL_CONTRIBUTION' && !params.goalId) {
      throw new Error('Un aporte a meta debe tener goalId.');
    }

    if (params.type === 'DEBT_PAYMENT' && !params.debtId) {
      throw new Error('Un pago de deuda debe tener debtId.');
    }
  }
}
