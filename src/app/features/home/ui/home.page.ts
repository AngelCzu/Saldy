import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonIcon } from '@ionic/angular/standalone';
import { Chart } from 'chart.js';
import { GenerateAnalysisUseCase } from '../../analysis/application/generate-analysis.usecase';
import { YearMonth } from 'src/app/domain/value-objects/year-month.vo';
import { DateRange } from 'src/app/domain/value-objects/date-range.vo';
import { DoughnutChartBuilder } from 'src/app/core/chart/doughnut-chart.builder';



@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, IonContent, IonIcon]
})
export class HomePage implements OnInit {

  // Graficos
  @ViewChild('expensesCanvas')
  expensesCanvas!: ElementRef<HTMLCanvasElement>;
  private expensesChart!: Chart<'doughnut'>;


  // Datos casos de prueba
  private analysisUseCase = new GenerateAnalysisUseCase();
  categories: { name: string; percentage: number, color: string }[] = [];


  analysisResult!: any;
  currentRange!: DateRange;
  
  constructor() { }

  loadAnalysis() {
    this.analysisResult =
      this.analysisUseCase.execute(this.currentRange);

    console.log(this.analysisResult.distribution);
    console.log(this.analysisResult.trend);
    this.categories = this.analysisResult.distribution;

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
  
  ngOnInit() {
    const month = YearMonth.create(2026, 1);
    this.currentRange = new DateRange(month, month);

    this.loadAnalysis();
  }

  ngAfterViewInit(){
    this.buildDoughnutChart()


  }
}