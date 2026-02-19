import { Chart, ChartDataset } from 'chart.js';
import { LineChartData } from './chart-config.types';

export class LineChartBuilder {

  static build(
    canvas: HTMLCanvasElement,
    data: LineChartData
  ): Chart<'line'> {

    const datasets: ChartDataset<'line'>[] = [];

    // 🔴 Expenses (obligatorio)
    datasets.push({
      data: data.expenses,
      borderColor: '#ad0d0dff',
      backgroundColor: 'rgba(200,33,33,0.08)',
      borderWidth: 2,
      tension: 0.4,
      pointRadius: 4,
      cubicInterpolationMode: 'monotone',
      pointHoverRadius: 6,
      pointBackgroundColor: '#ad0d0dff',
      pointBorderWidth: 0,
      label: 'Gastos'
    });

    // 🟢 Income (opcional)
    if (data.income && data.income.length > 0) {
      datasets.push({
        data: data.income,
        borderColor: '#0D9488',
        backgroundColor: 'rgba(13,148,136,0.08)',
        borderWidth: 2,
        tension: 0.4,
        pointRadius: 4,
        cubicInterpolationMode: 'monotone',
        pointHoverRadius: 6,
        pointBackgroundColor: '#0D9488',
        pointBorderWidth: 0,
        label: 'Ingresos'
      });
    }

    return new Chart<'line'>(canvas, {
      type: 'line',
      data: {
        labels: data.labels,
        datasets
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        animation: {
          duration: 1000,
          easing: 'easeOutQuart'
        },
        plugins: {
          legend: { display: true }
        }
      }
    });
  }
}
