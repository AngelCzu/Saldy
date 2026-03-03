import { bootstrapApplication } from '@angular/platform-browser';
import { RouteReuseStrategy, provideRouter, withPreloading, PreloadAllModules } from '@angular/router';
import { IonicRouteStrategy, provideIonicAngular } from '@ionic/angular/standalone';

import { routes } from './app/app.routes';
import { AppComponent } from './app/app.component';
import { environment } from './environments/environment';

// Firebase / FireStore
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { provideFirestore, getFirestore } from '@angular/fire/firestore';
import { provideAuth, getAuth } from '@angular/fire/auth';


// Importaciones iconos ionic
import { addIcons } from 'ionicons';
import * as allIcons from 'ionicons/icons';

// Importaciones de Chart
import './app/core/chart/chart-setup';

//Importaciones de tokens
import { AUTO_CLOSE_PERIOD, AUTH_REPOSITORY } from './app/core/providers/tokens';
import { provideAutoCloseMonthlyPeriodUseCase } from './app/core/providers/auto-close-monthly-period.provider';
import { FirebaseAuthRepository } from './app/data/repositories/firebase-auth.repository';


addIcons(allIcons);
bootstrapApplication(AppComponent, {
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    provideIonicAngular(),
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore()),
    provideRouter(routes, withPreloading(PreloadAllModules)),


    {
      provide: AUTO_CLOSE_PERIOD,
      useFactory: provideAutoCloseMonthlyPeriodUseCase
    },
    {
      provide: AUTH_REPOSITORY,
      useClass: FirebaseAuthRepository
    }
  ],
  
});
