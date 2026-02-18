import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonIcon } from '@ionic/angular/standalone';
import { Chart, DoughnutController, ArcElement, Tooltip } from 'chart.js';
Chart.register(DoughnutController, ArcElement, Tooltip);


@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, IonContent, IonIcon]
})
export class HomePage implements OnInit {
  
  constructor() { }
  
  
  ngOnInit() {
  }

  ngAfterViewInit(): void {
    const canvas = document.getElementById('expensesChart') as HTMLCanvasElement;
const CATEGORY_COLORS = [
  '#0D9488', // verde identidad
  '#2563EB', // azul
  '#7C3AED', // violeta
  '#0891B2', // cyan
  '#F59E0B', // ámbar
  '#DB2777', // rosado
  '#6B7280', // gris
];




new Chart(canvas, {
  type: 'doughnut',
  data: {
    labels: [
      'Comidas_Fuera',
      'Ropa',
      'Bencina',
      'Servicios',
      'Deudas_Mensuales',
      'Compras',
      'Otros'
    ],
    datasets: [
      {
        data: [22, 15, 14, 12, 9, 8, 7],
        backgroundColor: CATEGORY_COLORS,
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
