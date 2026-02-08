// MonthlyPeriod crea y usa el período

import { YearMonth } from "../value-objects/year-month.vo";

export class MonthlyPeriod {
  private readonly yearMonth: YearMonth
  private closed: boolean;

  private constructor(
    yearMonth: YearMonth,
    closed: boolean = false
  ) {
    this.yearMonth = yearMonth
    this.closed = closed;
  }

  // Forma segura de crear períodos
  static create(yearMonth: YearMonth): MonthlyPeriod { // El "static" sirve para que un metodo no necesite algo existente
    return new MonthlyPeriod(yearMonth, false);
  }

  // Reconstrucción desde persistencia (más adelante)
  static restore(
    yearMonth: YearMonth,
    closed: boolean
  ): MonthlyPeriod {
    return new MonthlyPeriod(yearMonth, closed);
  }



  
  // ======================
  // ESTADO
  // ======================

  isClosed(): boolean {
    return this.closed;
  }

  canEdit(): boolean {
    return !this.closed;
  }




  // ======================
  // COMPORTAMIENTO
  // ======================

  close(): void {
    if (this.closed) {
      throw new Error('El período mensual ya está cerrado.');
    }

    this.closed = true;
  }





  // ======================
  // GETTERS
  // ======================

  getYearMonth(): YearMonth {
    return this.yearMonth;
  }

  getId(): string {
    // Identidad estable, sin Date
    return this.yearMonth.toString();                                                               

}




  // ======================
  // VALIDACIONES
  // ======================

  private validateYear(year: number): void {
    if (!Number.isInteger(year) || year < 2000 || year > 2100) {
      throw new Error(`Año inválido para período mensual: ${year}`);
    }
  }

  private validateMonth(month: number): void {
    if (!Number.isInteger(month) || month < 1 || month > 12) {
      throw new Error(`Mes inválido para período mensual: ${month}`);
    }
  }
}
