import { Component, ElementRef, inject, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonIcon } from '@ionic/angular/standalone';
import { Chart } from 'chart.js';


import { DoughnutChartBuilder } from 'src/app/core/chart/doughnut-chart.builder';

import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { GenerateHomeViewUseCase } from '../application/generate-home-view.usecase';

import { HomeSummary } from '../application/generate-home-view.usecase';



@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, IonContent, IonIcon]
})
export class HomePage{

  // Graficos
  @ViewChild('expensesCanvas')
  expensesCanvas!: ElementRef<HTMLCanvasElement>;
  private expensesChart?: Chart<'doughnut'>;

  // Movimientos y Periodos
  private generateHomeView = inject(GenerateHomeViewUseCase);
  private alertCtrl = inject(AlertController);
  private router = inject(Router);

  loading = true;
  homeData!: HomeSummary;

  // Datos casos de prueba
  categories: { name: string; percentage: number, color: string }[] = [];


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

  
  constructor( ) { }

  async ionViewWillEnter() {
    await this.initialize();
  }

  private async initialize() {
    try {

      this.homeData = await this.generateHomeView.execute();

      if (this.homeData.balance < 0) {
        this.showWarning();
      }

      this.buildDoughnutChart();

    } finally {
      this.loading = false;
    }
  }

  private buildDoughnutChart() {

    if (this.expensesChart) {
      this.expensesChart.destroy();
    }

    const canvas = this.expensesCanvas?.nativeElement;
    if (!canvas || !this.homeData) return;

    const labels = Object.keys(this.homeData.categoryDistribution);
    const values = Object.values(this.homeData.categoryDistribution);

    const chartData = {
      labels,
      values,
      colors: this.mapColors(labels)
    };

    this.expensesChart =
      DoughnutChartBuilder.build(canvas, chartData);
  }


  private async showWarning() {
    const alert = await this.alertCtrl.create({
      header: 'Saldo negativo',
      message: 'Tus gastos superan tus ingresos este mes.',
      buttons: ['OK']
    });

    await alert.present();
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


}
