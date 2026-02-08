// Deudores 

export class Debt {
  private readonly id?: string;
  private readonly movementId: string;
  private readonly debtorName: string;
  private readonly amount: number;
  private paid: boolean;

  private constructor(params: {
    id?: string;
    movementId: string;
    debtorName: string;
    amount: number;
    paid: boolean;
  }) {
    this.validateMovementId(params.movementId);
    this.validateDebtorName(params.debtorName);
    this.validateAmount(params.amount);

    this.id = params.id;
    this.movementId = params.movementId;
    this.debtorName = params.debtorName;
    this.amount = params.amount;
    this.paid = params.paid;
  }


  // Crear una deuda nueva (pendiente) 
  static create(params: {
    movementId: string;
    debtorName: string;
    amount: number;
  }): Debt {
    return new Debt({
      movementId: params.movementId,
      debtorName: params.debtorName,
      amount: params.amount,
      paid: false,
    });
  }

  // Restaurar deuda desde Firestore 
  static restore(params: {
    id: string;
    movementId: string;
    debtorName: string;
    amount: number;
    paid: boolean;
  }): Debt {
    return new Debt(params);
  }




  // ======================
  // GETTERS
  // ======================

  getId(): string | undefined {
    return this.id;
  }

  getMovementId(): string {
    return this.movementId;
  }

  getDebtorName(): string {
    return this.debtorName;
  }

  getAmount(): number {
    return this.amount;
  }

  isPaid(): boolean {
    return this.paid;
  }





  // ======================
  // COMPORTAMIENTO
  // ======================

  markAsPaid(): void {
    if (this.paid) {
      throw new Error('La deuda ya está pagada.');
    }

    this.paid = true;
  }




  
  // ======================
  // VALIDACIONES
  // ======================

  private validateMovementId(movementId: string): void {
    if (!movementId || movementId.trim().length === 0) {
      throw new Error('La deuda debe estar asociada a un movimiento.');
    }
  }

  private validateDebtorName(name: string): void {
    if (!name || name.trim().length === 0) {
      throw new Error('El nombre del deudor es obligatorio.');
    }
  }

  private validateAmount(amount: number): void {
    if (!Number.isFinite(amount) || amount <= 0) {
      throw new Error('El monto de la deuda debe ser mayor a 0.');
    }
  }
}
