import { Component, inject, signal } from '@angular/core';
import { CommonModule, registerLocaleData } from '@angular/common';
import localeEsCL from '@angular/common/locales/es-CL';
import { FormsModule } from '@angular/forms';
import {
  IonContent,
  IonIcon,
  IonSpinner,
  ModalController,
} from '@ionic/angular/standalone';

import { SharedExpenseModal } from '../modals/shared-expense.modal/shared-expense.modal.component';


import { firstValueFrom, filter } from 'rxjs';
import { SessionService } from 'src/app/core/session/session.service';

import { CurrencyService } from 'src/app/core/services/currency.service';
import { RegisterMovementFacade } from '../../application/register-movement.facade';
import { initialUiState, setLoading, UiState } from 'src/app/core/state/ui-state';
import { CategoriesFacade } from 'src/app/features/categories/application/categories.facade';
import { ToastService } from 'src/app/core/ui/toast.service';


import { CategorySelectorComponent } from './components/category-selector/category-selector.component';
import { AmountInputComponent } from './components/amount-input/amount-input.component';
type TransactionType = 'income' | 'expense';
type Currency = 'clp' | 'uf';


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
  imports: [CommonModule, IonContent, IonIcon, FormsModule, IonSpinner, CategorySelectorComponent, AmountInputComponent ],
})
export class RegisterMovementPage {
  private modalCtrl = inject(ModalController);
  private currencyService = inject(CurrencyService);
  private movementFacade = inject(RegisterMovementFacade);

  private categoriesFacade = inject(CategoriesFacade);

  private sessionService = inject(SessionService);


  state = signal<UiState<void>>(initialUiState());
  private toast = inject(ToastService);

  touched = {
    title: false,
    amount: false,
    category: false
  };


  selectedCategory = '';

  transactionType: TransactionType = 'expense'; 
  title = '';
  amount: number | null = null;
  currency: Currency = 'clp';
  isShared = false;
  sharedExpenseData: SharedExpenseData | null = null;

  /* valor UF temporal (solo UI) */
  UF_VALUE = 37850;

  async ngOnInit() {
    await this.waitForSession();
    this.categoriesFacade.load();
  }

  private async waitForSession() {
    await firstValueFrom(
      this.sessionService.authInitialized$.pipe(
        filter(initialized => initialized === true)
      )
    );
  }

//==========================
//=== Controladores UI =====
//==========================


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
    this.amount =
      this.currency === 'uf'
        ? this.currencyService.parseUF(value)
        : this.currencyService.parseCLP(value);
  }

  getCLPAmount() {
    if (this.currency === 'uf') {
      return this.currencyService.calculateCLPFromUF(
        this.amount ?? 0,
        this.UF_VALUE,
      );
    }

    return this.amount ?? 0;
  }

  get displayAmount() {
    if (this.amount === null) return '';

    return this.currency === 'uf'
      ? this.currencyService.formatUF(this.amount)
      : this.currencyService.formatCLP(this.amount);
  }

  get categories() {
    return this.categoriesFacade.state().data ?? [];
  }

//==========================
//==== Loading ====
//==========================
  get isFormValid() {
    return !!this.amount && !!this.title && !!this.selectedCategory;
  }

  reloadCategories() {
    this.categoriesFacade.load();
  }

  get isSubmitting() {
    return this.state().loading;
  }

  get isLoadingCategories() {
    return this.categoriesFacade.state().loading;
  }

  get categoriesError() {
    return this.categoriesFacade.state().error;
  }

  get skeletonItems() {
    return Array(8).fill(0);
  }


//==========================
//====== Validadores ======
//==========================
  get isTitleInvalid() {
    return this.touched.title && !this.title;
  }

  get isAmountInvalid() {
    return this.touched.amount && !this.amount;
  }

  get isCategoryInvalid() {
    return this.touched.category && !this.selectedCategory;
  }

  selectCategory(id: string) {
    this.selectedCategory = id;
    this.touched.category = true;
  }


  //---------------------------------Correcciones---------------------------------------------------------

  

  private resetForm() {
    this.title = '';
    this.amount = null;
    this.selectedCategory = '';
    this.isShared = false;
    this.sharedExpenseData = null;
    this.currency = 'clp';
    this.transactionType = 'expense';

    this.touched = {
      title: false,
      amount: false,
      category: false
    };
  }

  async submitMovement() {
    if (!this.isFormValid) {
      this.touched.title = true;
      this.touched.amount = true;
      this.touched.category = true;

      this.toast.error('Completa los campos requeridos');
      return;
    }

    this.state.update(setLoading);


    try {
      if (this.amount == null) {
        throw new Error('Monto requerido');
      }

      await this.movementFacade.submit({
        type: this.transactionType,
        title: this.title,
        categoryId: this.selectedCategory || undefined,
        currency: this.currency,
        amount: this.amount,
        ufValue: this.currency === 'uf' ? this.UF_VALUE : undefined,
      });

      this.state.update(state => ({
        ...state,
        loading: false,
        error: null
      }));

      this.resetForm();

      // Toast Éxito
      this.toast.success('Movimiento registrado correctamente');

    } catch (error) {

      this.state.update(state => ({
        ...state,
        loading: false,
        error: 'No se pudo registrar el movimiento'
      }));

      // Toast Error
      this.toast.error('Error al registrar el movimiento');
    }
  }
  //---------------------------------Correcciones---------------------------------------------------------

  async openSharedExpenseModal() {
    const modal = await this.modalCtrl.create({
      component: SharedExpenseModal,
      componentProps: {
        totalAmount: this.getCLPAmount(),
      },
      breakpoints: [0, 0.85, 0.9],
      initialBreakpoint: 0.85,
      expandToScroll: false,
    });

    await modal.present();

    const { data } = await modal.onDidDismiss<SharedExpenseData>();

    if (data) {
      this.sharedExpenseData = data;
    }
  }


}
