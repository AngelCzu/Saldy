import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonIcon } from '@ionic/angular/standalone';

import { AmountInputComponent } from '../../register-movement/components/amount-input/amount-input.component';
import { CategorySelectorComponent } from '../../register-movement/components/category-selector/category-selector.component';


import { CategoryVM } from 'src/app/features/categories/models/category.model';
// =======================
// TYPES
// =======================

type TransactionType = 'income' | 'expense';
type Currency = 'clp' | 'uf';


export interface RegisterMovementFormValue {
  type: TransactionType;
  title: string;
  amount: number;
  currency: Currency;
  categoryId?: string;
  isShared: boolean;
  sharedData?: any;
}

// =======================
// COMPONENT
// =======================

@Component({
  selector: 'app-register-movement-form',
  standalone: true,
  templateUrl: './register-movement-form.component.html',
  styleUrls: ['./register-movement-form.component.scss'],
  imports: [
    CommonModule,
    FormsModule,
    IonIcon,
    AmountInputComponent,
    CategorySelectorComponent
  ]
})
export class RegisterMovementFormComponent {

  // =======================
  // INPUTS (desde PAGE)
  // =======================

  @Input() categories: CategoryVM[] = [];
  @Input() loadingCategories = false;
  @Input() categoriesError: string | null = null;
  @Input() ufValue = 0;

  // =======================
  // OUTPUTS (hacia PAGE)
  // =======================

  @Output() submitForm = new EventEmitter<RegisterMovementFormValue>();
  @Output() openSharedModal = new EventEmitter<number>();

  // =======================
  // STATE UI
  // =======================

  transactionType: TransactionType = 'expense';

  title = '';
  amount: number | null = null;
  currency: Currency = 'clp';

  selectedCategory = '';
  isShared = false;
  sharedExpenseData: any = null;

  touched = {
    title: false,
    amount: false,
    category: false
  };

  // =======================
  // UI ACTIONS
  // =======================

  setTransaction(type: TransactionType) {
    this.transactionType = type;

    // regla: ingresos siempre CLP
    if (type === 'income') {
      this.currency = 'clp';
    }
  }

  setCurrency(currency: Currency) {
    if (this.transactionType === 'income') {
      this.currency = 'clp';
      return;
    }

    this.currency = currency;
    this.amount = null; // reset limpio
  }

  onAmountInput(value: number) {
    this.amount = value;
  }

  selectCategory(id: string) {
    this.selectedCategory = id;
    this.touched.category = true;
  }

  toggleShared() {
    this.isShared = !this.isShared;

    if (!this.isShared) {
      this.sharedExpenseData = null;
    }
  }

  openShared() {
    this.openSharedModal.emit(this.getCLPAmount());
  }

  // =======================
  // HELPERS
  // =======================

  getCLPAmount(): number {
    if (!this.amount) return 0;

    if (this.currency === 'uf') {
      return this.amount * this.ufValue;
    }

    return this.amount;
  }

  get displayAmount(): string {
    if (this.amount === null) return '';
    return this.amount.toString();
  }

  // =======================
  // VALIDACIONES
  // =======================

  get isTitleInvalid() {
    return this.touched.title && !this.title;
  }

  get isAmountInvalid() {
    return this.touched.amount && !this.amount;
  }

  get isCategoryInvalid() {
    return this.touched.category && !this.selectedCategory;
  }

  get isFormValid() {
    return !!this.title && !!this.amount && !!this.selectedCategory;
  }

  // =======================
  // SUBMIT
  // =======================

  submit() {
    if (!this.isFormValid) {
      this.touched.title = true;
      this.touched.amount = true;
      this.touched.category = true;
      return;
    }

    this.submitForm.emit({
      type: this.transactionType,
      title: this.title,
      amount: this.amount!,
      currency: this.currency,
      categoryId: this.selectedCategory,
      isShared: this.isShared,
      sharedData: this.sharedExpenseData
    });
  }
}