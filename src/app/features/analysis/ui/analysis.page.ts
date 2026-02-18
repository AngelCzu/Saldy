import { Component, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonIcon, IonContent } from '@ionic/angular/standalone';
import { ViewDidEnter } from '@ionic/angular';
import { Category_Colors } from '../chart/chart.distr';
import {
  Chart,
  LineController,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Tooltip,
  Filler,
  Legend,
  DoughnutController,
  ArcElement
} from 'chart.js';

Chart.register(
  LineController,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Tooltip,
  Filler,
  Legend,
  DoughnutController,
  ArcElement
);

import { GenerateAnalysisUseCase } from '../application/generate-analysis.usecase';
import { DateRange } from 'src/app/domain/value-objects/date-range.vo';
import { YearMonth } from 'src/app/domain/value-objects/year-month.vo';


@Component({
  selector: 'app-analysis',
  templateUrl: './analysis.page.html',
  styleUrls: ['./analysis.page.scss'],
  standalone: true,
  imports: [CommonModule, IonIcon, IonContent],
})
export class AnalysisPage implements ViewDidEnter {

  private chart!: Chart;
  private chartDonut!: Chart;


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

    console.log(this.analysisResult);
    this.categories = this.analysisResult.distribution;

  }

  ionViewDidEnter(): void {

    const canvas = document.getElementById(
      'trendChart'
    ) as HTMLCanvasElement;

    
    const canvasDonut = document.getElementById('expensesChart') as HTMLCanvasElement;

    // ⚠️ Destruye instancia previa si existe
    if (this.chart) {
      this.chart.destroy();
    }

    if (this.chartDonut) {
      this.chartDonut.destroy();
    }



    this.chart = new Chart(canvas, {
      type: 'line',
      data: {
        labels: this.analysisResult.trend.labels,
        datasets: [
          /*{
            //Ingresos
            data: income, // 👈 IMPORTANTE: empieza vacío
            borderColor: '#0D9488',
            backgroundColor: 'rgba(13,148,136,0.08)',
            borderWidth: 2,
            tension: 0.4,
            pointRadius: 4,
            cubicInterpolationMode: 'monotone',
            pointHoverRadius: 6,
            pointBackgroundColor: '#0D9488',
            pointBorderWidth: 0,
            label: 'Ingresos',
          },*/
          {
            //Gastos
            data: this.analysisResult.trend.expenses, // 👈 IMPORTANTE: empieza vacío
            borderColor: '#ad0d0dff',
            backgroundColor: 'rgba(200, 33, 33, 0.08)',
            borderWidth: 2,
            tension: 0.4,
            pointRadius: 4,
            cubicInterpolationMode: 'monotone',
            pointHoverRadius: 6,
            pointBackgroundColor: '#ad0d0dff',
            pointBorderWidth: 0,
            label: 'Gastos'
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        animation: {
          duration: 1000,
          easing: 'easeOutQuart',

        },
        plugins: {
          legend: { display: true },
          
        },
      },
    });



  }

    
  ngAfterViewInit(): void {
    const canvas = document.getElementById('expensesChart') as HTMLCanvasElement;



  const labels = this.analysisResult.distribution.map((c: { name: any; }) => c.name);
  const values = this.analysisResult.distribution.map((c: { percentage: any; }) => c.percentage);
  const colors = this.analysisResult.distribution.map((c: { color: any; }) => c.color);

  
new Chart(canvas, {
  type: 'doughnut',
  data: {
    labels: labels,
    datasets: [
      {
        data: values,
        backgroundColor: colors,
        borderWidth: 2,
        borderColor: '#ffffff',
        spacing: 3
      }
    ]
  },
  options: {
    cutout: '60%',
    plugins: {
      legend: { display: false },
      tooltip: { enabled: false }
    }
  }
});

  }
  

}

