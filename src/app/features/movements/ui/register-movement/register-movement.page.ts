import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonContent, IonIcon } from '@ionic/angular/standalone';

import { FormsModule } from '@angular/forms';

import { registerLocaleData } from '@angular/common';
import localeEsCL from '@angular/common/locales/es-CL';

import { ModalController } from '@ionic/angular/standalone';
import { SharedExpenseModal } from '../modals/shared-expense.modal/shared-expense.modal.component'; 

type TransactionType = 'income' | 'expense';
type Currency = 'clp' | 'uf';

interface Category {
  id: string;
  name: string;
  icon: string;
  color: string;
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

  modalCtrl = inject(ModalController)

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

  getGridColumns(): number {

  const count = this.categories.length;

  if (count <= 4) return count;

  if (count <= 6) return 3;

  return 4;

}


  
  transactionType: TransactionType = 'expense';

  title = '';
  amount = '';
  currency: Currency = 'clp';
  isShared = false;
  toggleShared() {
  this.isShared = !this.isShared;
}

  /* valor UF temporal (solo UI) */
  UF_VALUE = 37850;

  setTransaction(type: TransactionType) {
    this.transactionType = type;
  }


  /* ---------------------------
    Cambiar moneda
  --------------------------- */

  setCurrency(currency: Currency) {
    this.currency = currency;
    this.amount = '';
  }

  /* ---------------------------
    Formatear monto
  --------------------------- */
formatAmount() {

  if (this.currency === 'uf') {

    let value = this.amount;

    // eliminar caracteres inválidos
    value = value.replace(/[^\d.]/g, '');

    // permitir solo un punto decimal
    const parts = value.split('.');

    if (parts.length > 2) {
      value = parts[0] + '.' + parts[1];
    }

    this.amount = value;

    return;
  }

  // CLP (solo enteros)

  const numeric = this.amount.replace(/\D/g, '');

  if (!numeric) {
    this.amount = '';
    return;
  }

  this.amount = new Intl.NumberFormat('es-CL')
    .format(parseInt(numeric));

}


/* ---------------------------
    Calcular CLP desde UF
  --------------------------- */

  calculateCLPFromUF() {

    const ufAmount = parseFloat(this.amount || '0');

    return Math.round(ufAmount * this.UF_VALUE);

  }




  /* ---------------------------
    Obtener monto numérico
  --------------------------- */

  getAmountNumber() {

    if (this.currency === 'uf') {
      return this.calculateCLPFromUF();
    }

    return parseInt(this.amount.replace(/\./g, '') || '0');

  }



  submitMovement() {

  console.log({
    type: this.transactionType,
    title: this.title,
    amount: this.amount,
    currency: this.currency,
    category: this.selectedCategory,
    isShared: this.isShared
  });

}



async openSharedExpenseModal() {

  const modal = await this.modalCtrl.create({
  component: SharedExpenseModal,
  componentProps: {
    totalAmount: this.amount
  },
    breakpoints: [0, 0.85, 0.9],
    initialBreakpoint: 0.85,
    expandToScroll: false
})

  await modal.present();

}


}