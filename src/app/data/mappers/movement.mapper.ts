import { Movement, MovementType } from "src/app/domain/entities/movement.entity";
import { YearMonth } from 'src/app/domain/value-objects/year-month.vo';
import { Timestamp } from '@angular/fire/firestore';


export type MovementDocument = {
  type: MovementType;
  amountCLP: number;
  currency: 'CLP' | 'UF';
  yearMonth: string;
  title: string;
  inputAmount?: number | null;
  ufValue?: number | null;
  categoryId?: string | null;
  goalId?: string | null;
  debtId?: string | null;
  createdAt: Timestamp;
};

export class MovementMapper {

  static toFirestore(movement: Movement): MovementDocument {
    return {
      type: movement.getType(),
      amountCLP: movement.getAmount(),
      currency: movement.getCurrency(),
      yearMonth: movement.getYearMonth().toString(),
      title: movement.getTitle(),

      inputAmount: movement.getOriginalAmount() ?? null,
      ufValue: movement.getUfValue() ?? null,

      categoryId: movement.getCategoryId() ?? null,
      goalId: movement.getGoalId() ?? null,   
      debtId: movement.getDebtId() ?? null,

      createdAt: Timestamp.fromDate(movement.getCreatedAt()),
    };
  }

  static fromFirestore(id: string, data: MovementDocument): Movement {
    if (!data.createdAt) {
      throw new Error('createdAt inválido en Firestore');
    }

    if (
      !data.type ||
      !data.amountCLP ||
      !data.yearMonth ||
      !data.currency ||
      !data.title ||
      !data.createdAt
    ) {
      throw new Error('Documento corrupto en Firestore');
    }

    if (!Number.isFinite(data.amountCLP)) {
      throw new Error('amountCLP inválido');
    }

    return Movement.restore({
      id,
      type: this.toMovementType(data.type),
      amountCLP: data.amountCLP,
      currency: this.toCurrency(data.currency),
      yearMonth: YearMonth.fromString(data.yearMonth),
      title: data.title,

      inputAmount: data.inputAmount ?? undefined,
      ufValue: data.ufValue ?? undefined,

      categoryId: data.categoryId ?? undefined,
      goalId: data.goalId ?? undefined,
      debtId: data.debtId ?? undefined,

      createdAt: data.createdAt.toDate(),
    });
  }

  private static toMovementType(value: MovementType): MovementType {
    return value;
  }

  private static toCurrency(value: 'CLP' | 'UF'): 'CLP' | 'UF' {
    return value;
  }
}
