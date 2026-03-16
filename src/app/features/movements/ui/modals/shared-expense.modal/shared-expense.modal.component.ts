import { Component, inject, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonIcon, IonContent } from '@ionic/angular/standalone';
import { FormsModule } from '@angular/forms';
import { ModalController } from '@ionic/angular/standalone';

type DivisionType = 'percentage' | 'clp';

interface Participant {
  id: string;
  name: string;
  amount: number;
  isCurrentUser: boolean;
}

@Component({
  selector: 'app-shared-expense-modal.component',
  standalone: true,
  templateUrl: './shared-expense.modal.component.html',
  styleUrls: ['./shared-expense.modal.component.scss'],
  imports: [CommonModule, IonIcon, IonContent, FormsModule],
})
export class SharedExpenseModal {

  participants: Participant[] = [
  {
    id: 'self',
    name: 'Tú',
    amount: 100,
    isCurrentUser: true
  }
];


  divisionType: DivisionType = 'percentage';


  modalCtrl = inject(ModalController)
  close() {
    this.modalCtrl.dismiss(this.buildSharedExpenseData());
  }

  setDivisionType(type: DivisionType) {
  this.divisionType = type;
}

  @Input() totalAmount!: number;

recalculateDivision() {

  const count = this.participants.length;

  if (this.divisionType === 'percentage') {

    const share = 100 / count;

    this.participants.forEach(p => {
      p.amount = parseFloat(share.toFixed(1));
    });

  } else {

    const share = this.totalAmount / count;

    this.participants.forEach(p => {
      p.amount = Math.round(share);
    });

  }

}

  addParticipant() {

  const newParticipant: Participant = {
    id: Date.now().toString(),
    name: '',
    amount: 0,
    isCurrentUser: false
  };

  this.participants.push(newParticipant);

  this.recalculateDivision();

}

removeParticipant(id: string) {

  this.participants = this.participants.filter(p => p.id !== id);

  this.recalculateDivision();

}


onAmountChange() {

  // luego aquí podremos validar que la suma sea correcta

}

trackById(index: number, item: Participant) {
  return item.id;
}

  private buildSharedExpenseData() {
    return {
      divisionType: this.divisionType,
      totalAmount: this.totalAmount,
      participants: this.participants.map((participant) => ({
        id: participant.id,
        name: participant.name,
        isCurrentUser: participant.isCurrentUser,
        amount: participant.amount,
        clpAmount: this.divisionType === 'percentage'
          ? Math.round(this.totalAmount * participant.amount / 100)
          : participant.amount
      }))
    };
  }
}
