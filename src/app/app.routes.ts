import { Routes } from '@angular/router';


//Test
import { RegisterExpensePage } from './features/movements/ui/register-expense/register-expense.page';
import { MovementListPage } from './features/movements/ui/movement-list/movement-list.page';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'analysis',
    pathMatch: 'full',

    // Test
    // component: MovementListPage
  },
  {
    path: 'home',
    loadComponent: () => import('./features/home/ui/home.page').then( m => m.HomePage)
  },
  {
    path: 'analysis',
    loadComponent: () => import('./features/analysis/ui/analysis.page').then( m => m.AnalysisPage)
  },

];
