import { Component, AfterViewInit, ViewChild, ElementRef, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonIcon, IonContent } from '@ionic/angular/standalone';
import { LineChartBuilder } from 'src/app/core/chart/line-chart.builder';
import { DoughnutChartBuilder } from 'src/app/core/chart/doughnut-chart.builder';
import { GenerateAnalysisUseCase } from '../application/generate-analysis.usecase';
import { DateRange } from 'src/app/domain/value-objects/date-range.vo';
import { YearMonth } from 'src/app/domain/value-objects/year-month.vo';
import { DateRangeSelectorComponent } from '../shared/components/date-range-selector/date-range-selector.component';
import { Chart } from 'chart.js';


@Component({
  selector: 'app-analysis',
  templateUrl: './analysis.page.html',
  styleUrls: ['./analysis.page.scss'],
  standalone: true,
  imports: [CommonModule, IonIcon, IonContent, DateRangeSelectorComponent],
})
export class AnalysisPage implements OnInit {

  @ViewChild('trendCanvas')
  trendCanvas!: ElementRef<HTMLCanvasElement>;
  private trendChart!: Chart<'line'>;

  @ViewChild('expensesCanvas')
  expensesCanvas!: ElementRef<HTMLCanvasElement>;
  private expensesChart!: Chart<'doughnut'>;



  private analysisUseCase = new GenerateAnalysisUseCase();
  currentRange!: DateRange;
  analysisResult!: any;
  categories: { name: string; percentage: number, color: string }[] = [];



  ngOnInit() {
    const month = YearMonth.create(2026, 1);
    this.currentRange = new DateRange(month, month);

    this.loadAnalysis();
  }
  loadAnalysis() {
    this.analysisResult =
      this.analysisUseCase.execute(this.currentRange);

    console.log(this.analysisResult.distribution);
    console.log(this.analysisResult.trend);
    this.categories = this.analysisResult.distribution;

  }


private buildLineChart() {

  const canvas = this.trendCanvas?.nativeElement;

  if (!canvas) {
    console.warn('Canvas Line no disponible');
    return;
  }

  // 🔥 Destruir solo si existe
  if (this.trendChart) {
    this.trendChart.destroy();
  }

  this.trendChart = LineChartBuilder.build(canvas, {
    labels: this.analysisResult.trend.labels,
    expenses: this.analysisResult.trend.expenses,
    income: this.analysisResult.trend.income
  });

}

private buildDoughnutChart() {

  const canvas = this.expensesCanvas?.nativeElement;

  if (!canvas) {
    console.warn('Canvas Doughnut no disponible');
    return;
  }

  if (this.expensesChart) {
    this.expensesChart.destroy();
  }

  const distribution = this.analysisResult.distribution;

  const labels = distribution.map((c: any) => c.name);
  const values = distribution.map((c: any) => c.percentage);
  const colors = distribution.map((c: any) => c.color);

  this.expensesChart = DoughnutChartBuilder.build(canvas, {
    labels,
    values,
    colors
  });

}

    
  ngAfterViewInit(): void {
    this.buildLineChart();
    this.buildDoughnutChart();

}
}
