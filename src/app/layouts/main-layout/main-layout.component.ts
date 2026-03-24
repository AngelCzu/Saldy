import { Component } from '@angular/core';
import { IonRouterOutlet, IonTabBar, IonTabButton, IonIcon, IonTabs } from '@ionic/angular/standalone';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [IonRouterOutlet, IonTabBar, IonTabButton, IonIcon, IonTabs, RouterModule],
  templateUrl: './main-layout.component.html'
})
export class MainLayoutComponent {}
