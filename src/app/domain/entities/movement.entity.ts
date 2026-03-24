// Movimientos 

import { MovementValidator } from '../validators/movement.validator';
import { YearMonth } from '../value-objects/year-month.vo';

export type MovementType =
  | 'INCOME'                 // Ingreso
  | 'EXPENSE'                // Gastos
  | 'GOAL_CONTRIBUTION'      // Metas
  | 'DEBT_PAYMENT';          // Pagos de deudas

  

export class Movement {
  private readonly id?: string;
  private readonly type: MovementType;
  private readonly amountCLP: number;        // Siempre en CLP (valor real)
  private readonly currency: 'CLP' | 'UF';
  private readonly yearMonth: YearMonth;
  private readonly title: string;

  private readonly inputAmount?: number;  // Lo que ingresó el usuario
  private readonly ufValue?: number;         // Valor UF en ese momento
  private readonly createdAt: Date;
  // Metadatos
  private readonly categoryId?: string;
  private readonly goalId?: string;
  private readonly debtId?: string;

  private constructor(params: {
    id?: string;
    type: MovementType;
    amountCLP: number;
    currency: 'CLP' | 'UF';
    yearMonth: YearMonth;
    title: string;
    categoryId?: string;
    inputAmount?: number;
    ufValue?: number;
    createdAt: Date;
    goalId?: string;
    debtId?: string;
  }) {

    // VALIDACIÓN CENTRALIZADA
    MovementValidator.validate({
      type: params.type,
      title: params.title,
      amountCLP: params.amountCLP,
      currency: params.currency,
      yearMonth: params.yearMonth,
      createdAt: params.createdAt,
      categoryId: params.categoryId,
      goalId: params.goalId,
      debtId: params.debtId,
      inputAmount: params.inputAmount,
      ufValue: params.ufValue,
    });

    // ASIGNACIONES
    this.id = params.id;
    this.type = params.type;
    this.amountCLP = params.amountCLP;
    this.currency = params.currency;
    this.yearMonth = params.yearMonth;
    this.title = params.title;
    this.categoryId = params.categoryId;
    this.inputAmount = params.inputAmount;
    this.ufValue = params.ufValue;
    this.goalId = params.goalId;
    this.debtId = params.debtId;
    this.createdAt = params.createdAt;
  }

  
  // Crear movimiento nuevo (aún no persistido)
    static create(params: {
    type: MovementType;
    amountCLP: number;
    currency: 'CLP' | 'UF'; 
    yearMonth: YearMonth;
    title: string;
    inputAmount?: number;
    ufValue?: number
    categoryId?: string;
    createdAt: Date
    goalId?: string;
    debtId?: string;
  }): Movement {
    return new Movement({
      ...params
    });
  }

  static createFromCommand(params: {
    type: MovementType;
    title: string;
    currency: 'CLP' | 'UF';
    amountCLP?: number;
    inputAmount?: number;
    ufValue?: number;
    yearMonth: YearMonth;
    createdAt: Date;
    categoryId?: string;
  }): Movement {

      let amountCLP =
      params.currency === 'UF'
        ? Math.round(params.inputAmount! * params.ufValue!)
        : params.amountCLP!;

    return Movement.create({
      ...params,
      amountCLP
    });
  }

  // Restaurar movimiento desde Firestore 
  static restore(params: {
    id: string;
    type: MovementType;
    amountCLP: number;
    currency: 'CLP' | 'UF'; 
    yearMonth: YearMonth;
    title: string;
    inputAmount?: number;
    ufValue?: number
    createdAt: Date; // obligatorio
    categoryId?: string;
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
    return this.amountCLP;
  }

  getYearMonth(): YearMonth {
    return this.yearMonth;
  }

  getCreatedAt(): Date {
    return this.createdAt;
  }

  getTitle(): string {
    return this.title;
  }

  getCategoryId(): string | undefined {
    return this.categoryId;
  }

  getCurrency(): 'CLP' | 'UF' {
    return this.currency;
  }

  getOriginalAmount(): number | undefined {
    return this.inputAmount;
  }

  getUfValue(): number | undefined {
    return this.ufValue;
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

  isUF(): boolean {
    return this.currency === 'UF';
  }

  isCLP(): boolean {
    return this.currency === 'CLP';
  }

  getGoalId(): string | undefined {
    return this.goalId;
  }

  getDebtId(): string | undefined {
    return this.debtId;
  }



}
