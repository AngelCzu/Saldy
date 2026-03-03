import { Chart } from 'chart.js';
import { DoughnutChartData } from './chart-config.types';

export class DoughnutChartBuilder {

  static build(
    canvas: HTMLCanvasElement,
    data: DoughnutChartData
  ): Chart<'doughnut'> {

    return new Chart(canvas, {
      type: 'doughnut',
      data: {
        labels: data.labels,
        datasets: [
          {
            data: data.values,
            backgroundColor: data.colors,
            borderWidth: 2,
            borderColor: '#ffffff',
            spacing: 3
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '60%',
        plugins: {
            legend: { display: false },
            tooltip: { enabled: false }
        }
      }
    });

  }

  static update(
    chart: Chart<'doughnut'>,
    data: DoughnutChartData
  ): void {

    chart.data.labels = data.labels;

    chart.data.datasets[0].data = data.values;
    chart.data.datasets[0].backgroundColor = data.colors;

    chart.update();

  }
}
