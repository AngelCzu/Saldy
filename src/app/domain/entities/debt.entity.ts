type DebtStatus = 'pending' | 'paid';

export class Debt {
  private readonly id?: string;
  private readonly movementId: string;
  private readonly debtorId: string;
  private readonly debtorName: string;
  private readonly amount: number;
  private status: DebtStatus;
  private readonly createdAt: Date;

  private constructor(params: {
    id?: string;
    movementId: string;
    debtorId: string;
    debtorName: string;
    amount: number;
    status: DebtStatus;
    createdAt: Date;
  }) {
    this.validateMovementId(params.movementId);
    this.validateDebtorName(params.debtorName);
    this.validateAmount(params.amount);

    this.id = params.id;
    this.movementId = params.movementId;
    this.debtorId = params.debtorId;
    this.debtorName = params.debtorName;
    this.amount = params.amount;
    this.status = params.status;
    this.createdAt = params.createdAt;
  }

  static create(params: {
    movementId: string;
    debtorId: string;
    debtorName: string;
    amount: number;
  }): Debt {
    return new Debt({
      movementId: params.movementId,
      debtorId: params.debtorId,
      debtorName: params.debtorName,
      amount: params.amount,
      status: 'pending',
      createdAt: new Date(),
    });
  }

  static restore(params: {
    id: string;
    movementId: string;
    debtorId: string;
    debtorName: string;
    amount: number;
    status: DebtStatus;
    createdAt: Date;
  }): Debt {
    return new Debt(params);
  }

  // ======================
  // GETTERS
  // ======================

  getId() {
    return this.id;
  }
  getMovementId() {
    return this.movementId;
  }
  getDebtorId() {
    return this.debtorId;
  }
  getDebtorName() {
    return this.debtorName;
  }
  getAmount() {
    return this.amount;
  }
  getStatus() {
    return this.status;
  }
  getCreatedAt() {
    return this.createdAt;
  }

  isPaid() {
    return this.status === 'paid';
  }

  // ======================
  // BEHAVIOR
  // ======================

  markAsPaid() {
    if (this.status === 'paid') {
      throw new Error('La deuda ya está pagada');
    }
    this.status = 'paid';
  }

  // ======================
  // VALIDATIONS
  // ======================

  private validateMovementId(movementId: string) {
    if (!movementId) throw new Error('movementId requerido');
  }

  private validateDebtorName(name: string) {
    if (!name?.trim()) throw new Error('Nombre requerido');
  }

  private validateAmount(amount: number) {
    if (!Number.isFinite(amount) || amount <= 0) {
      throw new Error('Monto inválido');
    }
  }
}
