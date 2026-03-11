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
import { AUTH_REPOSITORY, DEBT_REPOSITORY, MONTHLY_PERIOD_REPOSITORY, MOVEMENT_REPOSITORY } from './app/core/providers/tokens';
import { CategoryRepository } from './app/domain/repositories/category.repository';
import { FirebaseAuthRepository } from './app/data/repositories/firebase-auth.repository';
import { FirestoreCategoryRepository } from './app/data/repositories/firestore-category.repository';
import { FirestoreDebtRepository } from './app/data/repositories/firestore-debt.repository';
import { FirestoreMovementRepository } from './app/data/repositories/firestore-movement.repository';
import { FirestoreMonthlyPeriodRepository } from './app/data/repositories/firestore-monthly-period.repository';
import { FirestoreTimeProvider } from './app/data/services/firestore-time.provider';
import { TimeProvider } from './app/domain/services/time-provider';


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
      provide: AUTH_REPOSITORY,
      useClass: FirebaseAuthRepository
    },
    {
      provide: CategoryRepository,
      useClass: FirestoreCategoryRepository
    },

    {
      provide: TimeProvider,
      useClass: FirestoreTimeProvider
    },
    {
      provide: MOVEMENT_REPOSITORY,
      useClass: FirestoreMovementRepository
    },
    {
      provide: DEBT_REPOSITORY,
      useClass: FirestoreDebtRepository
    },
    {
      provide: MONTHLY_PERIOD_REPOSITORY,
      useClass: FirestoreMonthlyPeriodRepository
    }
  ],
  
});
