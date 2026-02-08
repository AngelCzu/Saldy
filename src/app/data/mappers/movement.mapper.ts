import { Movement } from "src/app/domain/entities/movement.entity";
import { YearMonth } from 'src/app/domain/value-objects/year-month.vo';

export class MovementMapper {
  static toFirestore(movement: Movement) {
    return {
      periodo: movement.getYearMonth().toString(),
      tipo: this.mapTypeToFirestore(movement.getType()),
      monto: movement.getAmount(),
      descripcion: movement.getDescription(),
      categoria: movement.getCategory() ?? null,
      frecuencia: movement['frequency'] ?? null,
      compartido: movement['isShared'] ?? false,
      metaId: movement['goalId'] ?? null,
      deudaId: movement['debtId'] ?? null,
      creadoEn: new Date().toISOString(),
    };
  }

  static fromFirestore(id: string, data: any): Movement {
    return Movement.restore({
      id,
      type: this.mapTypeFromFirestore(data.tipo),
      amount: data.monto,
      yearMonth: YearMonth.fromString(data.periodo),
      description: data.descripcion,
      category: data.categoria ?? undefined,
      frequency: data.frecuencia ?? undefined,
      isShared: data.compartido ?? false,
      goalId: data.metaId ?? undefined,
      debtId: data.deudaId ?? undefined,
    });
  }

  private static mapTypeToFirestore(type: string): string {
    const map: Record<string, string> = {
      INCOME: 'INGRESO',
      EXPENSE: 'GASTO',
      GOAL_CONTRIBUTION: 'APORTE_META',
      DEBT_PAYMENT: 'PAGO_DEUDA',
    };
    return map[type];
  }

  private static mapTypeFromFirestore(type: string): any {
    const map: Record<string, any> = {
      INGRESO: 'INCOME',
      GASTO: 'EXPENSE',
      APORTE_META: 'GOAL_CONTRIBUTION',
      PAGO_DEUDA: 'DEBT_PAYMENT',
    };
    return map[type];
  }
}
