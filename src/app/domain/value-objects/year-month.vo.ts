// YearMonth valida lo que se recibe de Firestore

export class YearMonth {
  private readonly year: number;
  private readonly month: number; // 1 - 12

  private constructor(year: number, month: number) {
    this.validateYear(year);
    this.validateMonth(month);

    this.year = year;
    this.month = month;
  }



  // Forma segura de crear períodos
  static create(year: number, month: number): YearMonth {
    return new YearMonth(year, month);
  }

  // Reconstrucción desde persistencia (más adelante)
  static fromString(value: string): YearMonth {
    // Espera formato YYYY-MM
    const [yearStr, monthStr] = value.split('-');

    const year = Number(yearStr);
    const month = Number(monthStr);

    return new YearMonth(year, month);
  }



  // ======================
  // GETTERS
  // ======================

  getYear(): number {
    return this.year;
  }

  getMonth(): number {
    return this.month;
  }

  toString(): string {
    return `${this.year}-${String(this.month).padStart(2, '0')}`; // padStart es para colocar caracteres al lado izquiero hasta cumplir
  }                                                               // con los caracteres solicitado




  // ======================
  // COMPARACIÓN
  // ======================

  equals(other: YearMonth): boolean {
    return (
      this.year === other.year &&
      this.month === other.month
    );
  }


  // ======================
  // COMPARACIÓN AVANZADA
  // ======================

  isAfter(other: YearMonth): boolean {
    if (this.year > other.year) return true;
    if (this.year === other.year && this.month > other.month) return true;
    return false;
  }

  isBefore(other: YearMonth): boolean {
    if (this.year < other.year) return true;
    if (this.year === other.year && this.month < other.month) return true;
    return false;
  }

  isAfterOrEqual(other: YearMonth): boolean {
    return this.equals(other) || this.isAfter(other);
  }

  isBeforeOrEqual(other: YearMonth): boolean {
    return this.equals(other) || this.isBefore(other);
  }


  // ======================
  // NAVEGACIÓN TEMPORAL
  // ======================

  next(): YearMonth {
    if (this.month === 12) {
      return new YearMonth(this.year + 1, 1);
    }
    return new YearMonth(this.year, this.month + 1);
  }

  previous(): YearMonth {
    if (this.month === 1) {
      return new YearMonth(this.year - 1, 12);
    }
    return new YearMonth(this.year, this.month - 1);
  }



  // ======================
  // VALIDACIONES
  // ======================

  private validateYear(year: number): void {
    if (!Number.isInteger(year) || year < 2000 || year > 2100) {   // Posiblemente, en el futuro, este techo de hasta que año es valido
      throw new Error(`Año inválido: ${year}`);
    }
  }

  private validateMonth(month: number): void {
    if (!Number.isInteger(month) || month < 1 || month > 12) {
      throw new Error(`Mes inválido: ${month}`);
    }
  }

  diffInMonths(other: YearMonth): number {
  return (
    (other.year - this.year) * 12 +
    (other.month - this.month)
  );
}

}
