import { DateRange } from 'src/app/domain/value-objects/date-range.vo';
import { YearMonth } from 'src/app/domain/value-objects/year-month.vo';
import { SYSTEM_CATEGORY_COLORS } from 'src/app/domain/value-objects/system-categories';
export interface AnalysisResult {
  trend: {
    labels: string[];
    income: number[];
    expenses: number[];
  };
  distribution: {
    name: string;
    percentage: number;
    color: string;
  }[];
}

export class GenerateAnalysisUseCase {

  execute(range: DateRange): AnalysisResult {

    if (range.getMonthCount() === 1) {
      return this.buildSingleMonth(range.from);
    }

    return this.buildRange(range);
  }

  private buildSingleMonth(month: YearMonth): AnalysisResult {

    return {
      trend: {
        labels: ['Día 1–7', 'Día 8–14', 'Día 15–21', 'Día 22–Fin Mes'],
        income: [750000, 750000, 775000, 777000],
        expenses: [200000, 285000, 300000, 390000]
      },
      distribution: [
        { name: 'Comidas Fuera', percentage: 14 },
        { name: 'Ropa', percentage: 15 },
        { name: 'Bencina', percentage: 22 },
        { name: 'Servicios', percentage: 12 },
        { name: 'Deudas Mensuales', percentage: 9 },
        { name: 'Compras', percentage: 8 },
        { name: 'Otros', percentage: 7 },
      ].map(c => ({
        ...c,
        color: SYSTEM_CATEGORY_COLORS[c.name] ?? '#999999'
        }))
    };
  }

  private buildRange(range: DateRange): AnalysisResult {

    const labels: string[] = [];
    let current = range.from;

    while (current.isBeforeOrEqual(range.to)) {
      labels.push(current.toString());
      current = current.next();
    }

    return {
      trend: {
        labels,
        income: labels.map(() => Math.floor(Math.random() * 2000)),
        expenses: labels.map(() => Math.floor(Math.random() * 400000))
      },
      distribution: [
        { name: 'Comidas', percentage: 30 },
        { name: 'Ropa', percentage: 18 },
        { name: 'Servicios', percentage: 22 },
        { name: 'Otros', percentage: 30 }
      ].map(c => ({
        ...c,
        color: SYSTEM_CATEGORY_COLORS[c.name] ?? '#999999'
        }))
    };
  }
}
