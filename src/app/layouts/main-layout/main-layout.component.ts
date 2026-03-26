import { Component } from '@angular/core';
import { IonTabBar, IonTabButton, IonIcon, IonLabel, IonTabs } from '@ionic/angular/standalone';


@Component({
  selector: 'app-main-layout',
  standalone: true,
  templateUrl: './main-layout.component.html',
  styleUrls: ['./main-layout.component.scss'],
  imports: [IonTabBar, IonTabButton, IonIcon, IonLabel, IonTabs]
})
export class MainLayoutComponent {}
