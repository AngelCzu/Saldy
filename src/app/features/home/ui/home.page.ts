import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonIcon } from '@ionic/angular/standalone';
import { Chart } from 'chart.js';
import { AnalysisResult, GenerateAnalysisUseCase } from '../../analysis/application/generate-analysis.usecase';
import { YearMonth } from 'src/app/domain/value-objects/year-month.vo';
import { DateRange } from 'src/app/domain/value-objects/date-range.vo';
import { DoughnutChartBuilder } from 'src/app/core/chart/doughnut-chart.builder';
import { AUTO_CLOSE_PERIOD } from
'src/app/core/providers/tokens';
import { AutoCloseMonthlyPeriodUseCase } from
'src/app/features/periods/application/auto-close-monthly-period.usecase';

import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';




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
  private expensesChart?: Chart<'doughnut'>;


  // Datos casos de prueba
  categories: { name: string; percentage: number, color: string }[] = [];


  analysisResult!: AnalysisResult;
  currentRange!: DateRange;
  
  constructor(
      // Datos casos de prueba
    private analysisUseCase: GenerateAnalysisUseCase,

    @Inject(AUTO_CLOSE_PERIOD)
    private autoClose: AutoCloseMonthlyPeriodUseCase,
      private alertCtrl: AlertController,
      private router: Router
  ) { }

  loadAnalysis() {
    this.analysisResult =
      this.analysisUseCase.execute(this.currentRange);
    this.categories = this.analysisResult.distribution;

  }

  private mapDistributionToChartData() {
  return {
    labels: this.analysisResult.distribution.map(c => c.name),
    values: this.analysisResult.distribution.map(c => c.percentage),
    colors: this.analysisResult.distribution.map(c => c.color)
  };
}

  private buildDoughnutChart() {
    const canvas = this.expensesCanvas?.nativeElement;
  
    if (!canvas) {
      console.warn('Canvas Doughnut no disponible');
      return;
    }
    const chartData = this.mapDistributionToChartData();
  
    this.expensesChart = DoughnutChartBuilder.build(canvas,chartData
    );
  
  }

  private refreshCharts() {

    if (!this.expensesChart || !this.analysisResult) {
      return;
    }

    const chartData = this.mapDistributionToChartData();

    DoughnutChartBuilder.update(this.expensesChart, chartData);

  }

  async showPendingDebtsModal(count: number) {
    const alert = await this.alertCtrl.create({
      header: 'Mes cerrado automáticamente',
      message: `Tienes ${count} deudas pendientes.`,
      buttons: [
        {
          text: 'Ver deudas',
          handler: () => {
            this.router.navigate(['/debts']);
          }
        },
        {
          text: 'OK',
          role: 'cancel'
        }
      ]
    });

    await alert.present();
  }

  
  async ngOnInit() {
    const month = YearMonth.create(2026, 1);
    this.currentRange = new DateRange(month, month);

    this.loadAnalysis();


    const result = await this.autoClose.execute();

    if (result.monthClosed && result.pendingDebtsCount > 0) {
      this.showPendingDebtsModal(result.pendingDebtsCount);
    }
  }

  ngAfterViewInit(){
    this.buildDoughnutChart()
  }

  ionViewDidEnter() {
    this.refreshCharts();
  }

}