import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonIcon } from '@ionic/angular/standalone';


@Component({
  selector: 'app-home-balance-card',
  templateUrl: './home-balance-card.component.html',
  styleUrls: ['./home-balance-card.component.scss'],
  standalone: true,
  imports: [CommonModule, IonIcon],
})
export class HomeBalanceCardComponent {

  @Input() income = 0;
  @Input() expense = 0;
  @Input() balance = 0;
  @Input() userName!: string;
}
