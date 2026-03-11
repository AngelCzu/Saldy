import { AfterViewInit, Component, ElementRef, Input, OnChanges, SimpleChanges, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { IonIcon } from '@ionic/angular/standalone';

import { Chart } from 'chart.js';
import { DoughnutChartBuilder } from 'src/app/core/chart/doughnut-chart.builder';
import { CategoryDistribution } from '../../../application/generate-home-view.usecase';

@Component({
  selector: 'app-home-expense-chart',
  templateUrl: './home-expense-chart.component.html',
  styleUrls: ['./home-expense-chart.component.scss'],
  standalone: true,
  imports: [CommonModule, RouterLink, IonIcon],
})
export class HomeExpenseChartComponent implements AfterViewInit, OnChanges{
  @Input() categories!: CategoryDistribution[];

  legendItems: {
    label: string;
    amount: number;
    percentage: number;
    color: string;
  } [] = [];

   // Graficos
  @ViewChild('expensesCanvas')
  expensesCanvas!: ElementRef<HTMLCanvasElement>;
  private expensesChart?: Chart<'doughnut'>;

  private viewReady = false;

  hasData = false;

  // Se crea al inicio
  ngAfterViewInit() {
    this.viewReady = true;
    this.buildChart();
  }

  // Se actualiza el grafico al recibir nuevos inputs
  ngOnChanges(changes: SimpleChanges) {

    if (changes['categories'] && this.viewReady) {
      this.buildChart();
    }

  }

  private mapColors(labels: string[]): string[] {

    const palette = [
      '#0D9488',
      '#2563EB',
      '#7C3AED',
      '#0891B2',
      '#F59E0B',
      '#DB2777',
      '#6B7280',
    ];

    return labels.map((_, index) => palette[index % palette.length]);
  }

  private buildChart() {

    if (!this.categories || this.categories.length === 0) {
      this.hasData = false;
      return;
    }

    if (!this.expensesCanvas) return;

    this.hasData = true;

    if (this.expensesChart) {
      this.expensesChart.destroy();
    }

    const labels = this.categories.map(c => c.name);
    const values = this.categories.map(c => c.amount);

    const colors = this.mapColors(labels);

    const total = values.reduce((a, b) => a + b, 0);

    this.legendItems = labels.map((label, index) => {

      const amount = values[index];

      return {
        label,
        amount,
        percentage: total ? Math.round((amount / total) * 100) : 0,
        color: colors[index]
      };

    });

    const chartData = {
      labels,
      values,
      colors
    };

    this.expensesChart =
      DoughnutChartBuilder.build(
        this.expensesCanvas.nativeElement,
        chartData
      );
  }

}
