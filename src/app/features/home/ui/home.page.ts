import { Component, inject } from '@angular/core';
import { NgIf } from '@angular/common';
import { IonContent, IonIcon } from '@ionic/angular/standalone';
import { SessionService } from 'src/app/core/session/session.service';

import { GenerateHomeViewUseCase } from '../application/generate-home-view.usecase';
import { HomeSummary } from '../application/generate-home-view.usecase';

import { HomeBalanceCardComponent } from './components/home-balance-card/home-balance-card.component';
import { HomeExpenseChartComponent } from './components/home-expense-chart/home-expense-chart.component';


@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  standalone: true,
  styleUrls: ['./home.page.scss'],
  imports: [
    NgIf,
    IonContent,
    HomeBalanceCardComponent,
    HomeExpenseChartComponent,
    IonIcon
  ]
})
export class HomePage {

  private generateHomeView = inject(GenerateHomeViewUseCase);
  private session = inject(SessionService);

  homeData?: HomeSummary;

  get userName(): string {
    const user = this.session.currentUser;
    if (user?.displayName?.trim()) return user.displayName;
    if (user?.email?.trim()) return user.email.split('@')[0];
    return 'Usuario';
  }

  async ionViewWillEnter() {
    this.homeData = await this.generateHomeView.execute();
    console.log(this.homeData);
    
  }

}
