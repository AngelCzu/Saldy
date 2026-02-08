import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { RegisterSharedExpenseUseCase } from '../../application/register-shared-expense.usecase';

@Component({
  selector: 'app-register-expense',
  standalone: true,
  imports: [CommonModule, FormsModule, IonicModule],
  templateUrl: './register-expense.page.html',
  styleUrls: ['./register-expense.page.scss'],
})
export class RegisterExpensePage {

  amount = 0;
  description = '';
  category = '';

  constructor(
    @Inject('REGISTER_SHARED_EXPENSE')
    private registerSharedExpense: RegisterSharedExpenseUseCase
  ) {}

  async save() {
    await this.registerSharedExpense.execute({
      amount: this.amount,
      description: this.description,
      category: this.category,
      participants: [],
    });
  }
}
