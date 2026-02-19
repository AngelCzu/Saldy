import { bootstrapApplication } from '@angular/platform-browser';
import { RouteReuseStrategy, provideRouter, withPreloading, PreloadAllModules } from '@angular/router';
import { IonicRouteStrategy, provideIonicAngular } from '@ionic/angular/standalone';

import { routes } from './app/app.routes';
import { AppComponent } from './app/app.component';
import { environment } from './environments/environment';

// Firebase / FireStore
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { provideFirestore, getFirestore } from '@angular/fire/firestore';

// Importaciones casos de uso
import { provideRegisterSharedExpenseUseCase } from './app/core/providers/register-shared-expense.provider';
import { providePayDebtUseCase } from './app/core/providers/pay-debt.provider';
import { provideListMovementsUseCase } from './app/core/providers/list-movements';

// Importaciones iconos ionic
import { addIcons } from 'ionicons';
import * as allIcons from 'ionicons/icons';

// Importaciones de Chart
import './app/core/chart/chart-setup';


addIcons(allIcons);
bootstrapApplication(AppComponent, {
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    provideIonicAngular(),
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideFirestore(() => getFirestore()),
    provideRouter(routes, withPreloading(PreloadAllModules)),

    
    // Test Casos de Usos
     {
      provide: 'REGISTER_SHARED_EXPENSE',
      useFactory: provideRegisterSharedExpenseUseCase,
    },
    {
      provide: 'PAY_DEBT',
      useFactory: providePayDebtUseCase,
    },
    {
      provide: 'LIST_MOVEMENTS',
      useFactory: provideListMovementsUseCase,
    },
  ],
  
});
