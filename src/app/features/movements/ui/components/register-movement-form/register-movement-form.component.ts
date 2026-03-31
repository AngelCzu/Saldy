import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators, FormControl, FormGroup } from '@angular/forms';
import { IonIcon, ModalController } from '@ionic/angular/standalone';

import { AmountInputComponent } from '../amount-input/amount-input.component';
import { CategorySelectorComponent } from '../category-selector/category-selector.component';
import { IonSpinner } from '@ionic/angular/standalone';

import { SharedExpenseData } from '../../../models/shared-expense.model';
import { CategoryVM } from 'src/app/features/categories/models/category.model';
import { SubmitMovementData, TransactionType, Currency } from '../../../models/submit-movement.model';
import { SharedExpenseModal } from '../../modals/shared-expense.modal/shared-expense.modal.component';
// =======================
// TYPES
// =======================

type RegisterMovementFormGroup = FormGroup<{
  type: FormControl<TransactionType>;
  title: FormControl<string>;
  amount: FormControl<number | null>;
  currency: FormControl<Currency>;
  categoryId: FormControl<string>;
  isShared: FormControl<boolean>;
}>;



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
    ReactiveFormsModule,
    IonIcon,
    AmountInputComponent,
    CategorySelectorComponent,
    IonSpinner
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
  @Input() isSubmitting = false;
  @Input() sharedData: SharedExpenseData | null = null;

  // =======================
  // OUTPUTS (hacia PAGE)
  // =======================

  @Output() submitForm = new EventEmitter<SubmitMovementData>();
  @Output() sharedCleared = new EventEmitter<void>();
  @Output() formDirtyChange = new EventEmitter<boolean>();

  // =======================
  // STATE UI
  // =======================

  private fb = inject(FormBuilder);

  private modalCtrl = inject(ModalController);

  form: RegisterMovementFormGroup = this.fb.group({
    type: this.fb.control<TransactionType>('expense', {nonNullable: true,validators: [Validators.required]}),
    title: this.fb.control('', { nonNullable: true, validators: [Validators.required] }),
    amount: this.fb.control<number | null>(null, Validators.required),
    currency: this.fb.control<Currency>('clp', {nonNullable: true, validators: [Validators.required]}),
    categoryId: this.fb.control('', { nonNullable: true, validators: [Validators.required] }),
    isShared: this.fb.control(false, { nonNullable: true }),
  });



  // =======================
  // UI ACTIONS
  // =======================


  setTransaction(type: TransactionType) {
    this.form.patchValue({ type });

    // regla: ingresos siempre CLP
    if (type === 'income') {
       this.form.patchValue({ currency: 'clp' });
    }
  }

  setCurrency(currency: Currency) {
    if (this.type === 'income') return;

    this.form.patchValue({
      currency,
      amount: null
    });
  }

  onAmountInput(value: string) {
    const parsed = parseFloat(value);

    const control = this.form.get('amount');

    this.form.patchValue({
      amount: Number.isFinite(parsed) ? parsed : null
    });

    control?.markAsDirty();
    control?.markAsTouched();
    this.notifyDirty();

    if (this.form.get('isShared')?.value) {
      this.sharedCleared.emit();
    }
  }

  selectCategory(id: string) {
    const control = this.form.get('categoryId');

    control?.setValue(id);
    control?.markAsDirty();
    control?.markAsTouched();
    this.notifyDirty();
  }

  toggleShared() {
    const control = this.form.get('isShared');

    const current = control!.value;

    control?.setValue(!current);
    control?.markAsDirty();

    this.notifyDirty();

    if (current) {
      this.sharedData = null;
      this.sharedCleared.emit();
    }
  }

  async openShared() {

    const amount = this.form.get('amount')?.value;
    if (!amount) return;

    const modal = await this.modalCtrl.create({
      component: SharedExpenseModal,
      componentProps: {
        totalAmount: this.getCLPAmount()
      },
      breakpoints: [0, 0.85, 0.9],
      initialBreakpoint: 0.85,
      expandToScroll: false,
    });

    await modal.present();

    const { data } = await modal.onDidDismiss<SharedExpenseData>();

    if (data) {
      this.sharedData = data;
      this.form.markAsDirty();
      this.notifyDirty(); // 🔥 CLAVE

    }
  }

  // =======================
  // HELPERS
  // =======================

  
  get type() {
    return this.form.get('type')!.value;
  }

  get amount() {
    return this.form.controls.amount.value
  }

  get currency(): Currency {
    return this.form.controls.currency.value;
  }


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

  isInvalid(control: keyof RegisterMovementFormGroup['controls']): boolean {
    const c = this.form.controls[control];
    return c.invalid && c.touched;
  }

  hasChanges(): boolean {
    return this.form.dirty;
  }

  private notifyDirty() {
    this.formDirtyChange.emit(this.form.dirty);
  }
  // =======================
  // SUBMIT
  // =======================

  submit() {
    if (this.isSubmitting) return;

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const value = this.form.getRawValue();

    this.submitForm.emit({
      type: value.type!,
      title: value.title!,
      amount: value.amount!,
      currency: value.currency!,
      categoryId: value.categoryId!,
      isShared: value.isShared!,
      sharedData: value.isShared ? this.sharedData : null,
      ufValue: value.currency === 'uf' ? this.ufValue : undefined
    });

    this.reset();
  }

  reset() {
    this.form.reset({
      type: 'expense',
      currency: 'clp',
      isShared: false
    });
  }
}