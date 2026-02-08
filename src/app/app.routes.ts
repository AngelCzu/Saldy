import { Routes } from '@angular/router';


//Test
import { RegisterExpensePage } from './features/movements/ui/register-expense/register-expense.page';
import { MovementListPage } from './features/movements/ui/movement-list/movement-list.page';

export const routes: Routes = [
  {
    path: '',
    //edirectTo: 'home',
    //pathMatch: 'full',

    component: MovementListPage
  },
  {
    path: 'home',
    loadComponent: () => import('./features/home/ui/home/home.page').then( m => m.HomePage)
  },
];
