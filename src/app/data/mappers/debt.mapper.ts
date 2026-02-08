// Mapa 

import { Debt } from "src/app/domain/entities/debt.entity";

export class DebtMapper {
  static toFirestore(debt: Debt) {
    return {
      movimientoId: debt.getMovementId(),
      nombre: debt.getDebtorName(),
      monto: debt.getAmount(),
      pendiente: !debt.isPaid(),
    };
  }

  static fromFirestore(id: string, data: any): Debt {
    return Debt.restore({
      id,
      movementId: data.movimientoId,
      debtorName: data.nombre,
      amount: data.monto,
      paid: !data.pendiente,
    });
  }
}
