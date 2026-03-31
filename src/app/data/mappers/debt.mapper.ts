// Mapa 

import { Debt } from "src/app/domain/entities/debt.entity";
import { Timestamp } from '@angular/fire/firestore';

export class DebtMapper {
  static toFirestore(debt: Debt) {
  return {
    movementId: debt.getMovementId(),
    debtorId: debt.getDebtorId(),
    debtorName: debt.getDebtorName(),
    amount: debt.getAmount(),
    status: debt.getStatus(),
    createdAt: Timestamp.fromDate(debt.getCreatedAt()),
  };
}

static fromFirestore(id: string, data: any): Debt {
  return Debt.restore({
    id,
    movementId: data.movementId,
    debtorId: data.debtorId,
    debtorName: data.debtorName,
    amount: data.amount,
    status: data.status,
    createdAt: data.createdAt?.toDate?.() ?? new Date(),
  });
}
}
