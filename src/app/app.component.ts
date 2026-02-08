import { Component, Inject } from '@angular/core';
import { IonApp, IonRouterOutlet } from '@ionic/angular/standalone';


// Test
import { SessionService } from './core/session/session.service';
import { RegisterSharedExpenseUseCase } from './features/movements/application/register-shared-expense.usecase';
import { PayDebtUseCase } from './features/debts/application/pay-debt.usecase';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  imports: [IonApp, IonRouterOutlet],
})
export class AppComponent {

  
  constructor(
    //        Test llamados para correr
             private session: SessionService,
             @Inject('REGISTER_SHARED_EXPENSE')
             private registerSharedExpense: RegisterSharedExpenseUseCase,
             @Inject('PAY_DEBT')
             private payDebt: PayDebtUseCase

  ) {
    //Test
    
    //this.test();
  }

  // Test Tareas
  async test() {
  await this.registerSharedExpense.execute({
    amount: 15000,
    description: 'Compra cumpleaños',
    category: 'Supermercado',
    participants: [
      { name: 'Juan', amount: 5000 },
      { name: 'Pedro', amount: 5000 },
    ],
  });
  
}
}
