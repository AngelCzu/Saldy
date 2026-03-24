import { MovementType } from '../entities/movement.entity';
import { YearMonth } from '../value-objects/year-month.vo';

export class MovementValidator {

  // ======================
  // ENTRY POINT 🔥
  // ======================

  static validate(params: {
    type: MovementType;
    title: string;
    amountCLP: number;
    currency: 'CLP' | 'UF';
    yearMonth: YearMonth;
    createdAt: Date;
    categoryId?: string;
    goalId?: string;
    debtId?: string;
    inputAmount?: number;
    ufValue?: number;
  }): void {

    this.validateBase(params);
    this.validateDates(params);
    this.validateCurrency(params);
    this.validateType(params);
  }

  // ======================
  // BASE
  // ======================

  private static validateBase(params: {
    title: string;
    amountCLP: number;
  }): void {

    if (!params.title || params.title.trim().length === 0) {
      throw new Error('El título es obligatorio');
    }

    if (!Number.isFinite(params.amountCLP) || params.amountCLP <= 0) {
      throw new Error('El monto debe ser mayor a 0.');
    }
  }

  // ======================
  // FECHAS
  // ======================

  private static validateDates(params: {
    createdAt: Date;
    yearMonth: YearMonth;
  }): void {

    if (!(params.createdAt instanceof Date)) {
      throw new Error('createdAt inválido');
    }

    const ym = YearMonth.fromDate(params.createdAt);

    if (!ym.equals(params.yearMonth)) {
      throw new Error('createdAt no coincide con yearMonth');
    }
  }

  // ======================
  // MONEDA
  // ======================

  private static validateCurrency(params: {
    currency: 'CLP' | 'UF';
    amountCLP: number;
    inputAmount?: number;
    ufValue?: number;
  }): void {

    if (params.currency === 'UF') {

      if (params.inputAmount == null || params.ufValue == null) {
        throw new Error('Movimientos en UF requieren inputAmount y ufValue.');
      }

      if (params.inputAmount <= 0 || params.ufValue <= 0) {
        throw new Error('Valores UF inválidos.');
      }
    }

    if (params.currency === 'CLP') {

      if (params.inputAmount != null || params.ufValue != null) {
        throw new Error('Movimientos en CLP no deben tener datos UF.');
      }

        if (!Number.isFinite(params.amountCLP) || params.amountCLP <= 0) {
            throw new Error('CLP requiere amountCLP válido');
        }

    }
  }

  // ======================
  // REGLAS POR TIPO 🔥
  // ======================

  private static validateType(params: {
    type: MovementType;
    categoryId?: string;
    goalId?: string;
    debtId?: string;
    currency: 'CLP' | 'UF';
  }): void {

    switch (params.type) {

      case 'EXPENSE':
        this.validateExpense(params);
        break;

      case 'INCOME':
        this.validateIncome(params);
        break;

      case 'GOAL_CONTRIBUTION':
        this.validateGoal(params);
        break;

      case 'DEBT_PAYMENT':
        this.validateDebt(params);
        break;

      default:
        throw new Error(`Tipo de movimiento no soportado: ${params.type}`);
    }
  }

  private static validateExpense(params: {
    categoryId?: string;
    goalId?: string;
    debtId?: string;
  }): void {

    if (!params.categoryId) {
      throw new Error('Un gasto debe tener categoría.');
    }

    if (params.goalId || params.debtId) {
      throw new Error('Un gasto no debe tener goalId ni debtId.');
    }
  }

  private static validateIncome(params: {
    categoryId?: string;
    goalId?: string;
    debtId?: string;
    currency: 'CLP' | 'UF';
  }): void {

    if (params.categoryId) {
      throw new Error('Un ingreso no debe tener categoría.');
    }

    if (params.currency !== 'CLP') {
      throw new Error('Un ingreso solo puede ser en CLP.');
    }

    if (params.goalId || params.debtId) {
      throw new Error('Un ingreso no debe tener goalId ni debtId.');
    }
  }

  private static validateGoal(params: {
    goalId?: string;
    categoryId?: string;
    debtId?: string;
  }): void {

    if (!params.goalId) {
      throw new Error('Un aporte a meta debe tener goalId.');
    }

    if (params.debtId) {
      throw new Error('Un aporte a meta no debe tener debtId.');
    }

    if (!params.categoryId) {
      throw new Error('Un aporte a meta debe tener categoryId.');
    }
  }

  private static validateDebt(params: {
    debtId?: string;
    categoryId?: string;
    goalId?: string;
  }): void {

    if (!params.debtId) {
      throw new Error('Un pago de deuda debe tener debtId.');
    }

    if (params.categoryId || params.goalId) {
      throw new Error('Un pago de deuda no debe tener categoryId ni goalId.');
    }
  }

}