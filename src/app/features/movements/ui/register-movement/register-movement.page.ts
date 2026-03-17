import { Component, inject } from '@angular/core';
import { CommonModule, registerLocaleData } from '@angular/common';
import localeEsCL from '@angular/common/locales/es-CL';
import { FormsModule } from '@angular/forms';
import { IonContent, IonIcon, ModalController } from '@ionic/angular/standalone';

import { SharedExpenseModal } from '../modals/shared-expense.modal/shared-expense.modal.component';

type TransactionType = 'income' | 'expense';
type Currency = 'clp' | 'uf';

interface Category {
  id: string;
  name: string;
  icon: string;
  color: string;
}

interface SharedExpenseData {
  divisionType: 'percentage' | 'clp';
  totalAmount: number;
  participants: {
    id: string;
    name: string;
    isCurrentUser: boolean;
    amount: number;
    clpAmount: number;
  }[];
}

registerLocaleData(localeEsCL);

@Component({
  selector: 'app-register-movement',
  standalone: true,
  templateUrl: './register-movement.page.html',
  styleUrls: ['./register-movement.page.scss'],
  imports: [CommonModule, IonContent, IonIcon, FormsModule]
})
export class RegisterMovementPage {

  modalCtrl = inject(ModalController);

  categories: Category[] = [
    { id: 'food', name: 'Comida', icon: 'cafe-outline', color: '#f97316' },
    { id: 'transport', name: 'Transporte', icon: 'car-outline', color: '#3b82f6' },
    { id: 'home', name: 'Hogar', icon: 'home-outline', color: '#8b5cf6' },
    { id: 'subscriptions', name: 'Suscripciones', icon: 'tv-outline', color: '#ef4444' },
    { id: 'leisure', name: 'Ocio', icon: 'game-controller-outline', color: '#ec4899' },
    { id: 'shopping', name: 'Compras', icon: 'card-outline', color: '#6366f1' },
    { id: 'other', name: 'Otros', icon: 'sparkles-outline', color: '#6b7280' }
  ];

  selectedCategory = '';

  transactionType: TransactionType = 'expense';
  title = '';
  amount: number | null = null;
  currency: Currency = 'clp';
  isShared = false;
  sharedExpenseData: SharedExpenseData | null = null;

  /* valor UF temporal (solo UI) */
  UF_VALUE = 37850;

  getGridColumns(): number {
    const count = this.categories.length;

    if (count <= 4) return count;
    if (count <= 6) return 3;

    return 4;
  }

  toggleShared() {
    this.isShared = !this.isShared;

    if (!this.isShared) {
      this.sharedExpenseData = null;
    }
  }

  setTransaction(type: TransactionType) {
    this.transactionType = type;

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
    this.amount = null;
  }

  onAmountInput(value: string) {
    if (this.currency === 'uf') {
      this.amount = this.parseUFInput(value);
      return;
    }

    const numeric = value.replace(/\D/g, '');
    this.amount = numeric ? Number(numeric) : null;
  }

  calculateCLPFromUF() {
    const ufAmount = this.amount ?? 0;
    return Math.round(ufAmount * this.UF_VALUE);
  }

  getUFAmount() {
    if (this.currency !== 'uf') {
      return null;
    }

    return this.UF_VALUE ?? 0;
  }

  getCLPAmount() {
    if (this.currency === 'uf') {
      return this.calculateCLPFromUF();
    }

    return this.amount ?? 0;
  }

  getAmountNumber() {
    return this.getCLPAmount();
  }

  submitMovement() {

    if (this.transactionType == 'expense' && this.currency == 'clp' ) {
        console.log({
        type: this.transactionType,
        title: this.title,
        amount: this.amount,
        currency: this.currency,
        category: this.selectedCategory,
        isShared: this.isShared,
        sharedExpense: this.sharedExpenseData
      });
    }

    if (this.transactionType == 'expense' && this.currency == 'uf' ) {
    console.log({
        type: this.transactionType,
        title: this.title,
        amount_uf: this.amount,
        ufAmount: this.getUFAmount(),
        clpAmount: this.getCLPAmount(),
        currency: this.currency,
        category: this.selectedCategory,
        isShared: this.isShared,
        sharedExpense: this.sharedExpenseData
      });
    }

    if (this.transactionType == 'income' ) {
        console.log({
        type: this.transactionType,
        title: this.title,
        amount: this.amount,
        currency: this.currency,
      });
    }
    
  }

  async openSharedExpenseModal() {
    const modal = await this.modalCtrl.create({
      component: SharedExpenseModal,
      componentProps: {
        totalAmount: this.getAmountNumber()
      },
      breakpoints: [0, 0.85, 0.9],
      initialBreakpoint: 0.85,
      expandToScroll: false
    });

    await modal.present();

    const { data } = await modal.onDidDismiss<SharedExpenseData>();

    if (data) {
      this.sharedExpenseData = data;
    }
  }

  private formatUFDisplay(integerPart: string, decimalPart: string) {
    if (!integerPart && !decimalPart) {
      return '';
    }

    const formattedInteger = integerPart
      ? new Intl.NumberFormat('es-CL').format(parseInt(integerPart, 10))
      : '0';

    return decimalPart ? `${formattedInteger},${decimalPart}` : formattedInteger;
  }

  private parseUFInput(value: string) {
    const sanitizedValue = value.replace(/[^\d.,]/g, '');
    const lastCommaIndex = sanitizedValue.lastIndexOf(',');

    if (lastCommaIndex >= 0) {
      const integerPart = sanitizedValue.slice(0, lastCommaIndex).replace(/[^\d]/g, '');
      const decimalPart = sanitizedValue.slice(lastCommaIndex + 1).replace(/[^\d]/g, '');
      const normalizedNumber = decimalPart
        ? `${integerPart || '0'}.${decimalPart}`
        : integerPart;

      return normalizedNumber ? Number(normalizedNumber) : null;
    }

    const integerPart = sanitizedValue.replace(/[^\d]/g, '');
    return integerPart ? Number(integerPart) : null;
  }

  get displayAmount() {
    if (this.amount === null) {
      return '';
    }

    if (this.currency === 'uf') {
      const [integerPart, decimalPart = ''] = this.amount.toString().split('.');
      return this.formatUFDisplay(integerPart, decimalPart);
    }

    return new Intl.NumberFormat('es-CL').format(this.amount);
  }
}
