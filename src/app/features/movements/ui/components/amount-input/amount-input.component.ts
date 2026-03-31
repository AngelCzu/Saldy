import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

type Currency = 'clp' | 'uf';

@Component({
  selector: 'app-amount-input',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './amount-input.component.html',
  styleUrls: ['./amount-input.component.scss'],
})
export class AmountInputComponent {

  // Inputs
  @Input() currency: Currency = 'clp';
  @Input() displayAmount: string = '';
  @Input() invalid = false;
  @Input() ufValue = 0;
  @Input() showUFInfo = false;
  @Input() clpAmount = 0;

  // Outputs
  @Output() currencyChange = new EventEmitter<Currency>();
  @Output() amountChange = new EventEmitter<string>();
  @Output() blur = new EventEmitter<void>();

  setCurrency(currency: Currency) {
    this.currencyChange.emit(currency);
  }

  onInput(value: string) {
    this.amountChange.emit(value);
  }

  onBlur() {
    this.blur.emit();
  }
}