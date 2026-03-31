import { Component, inject } from '@angular/core';
import { IonTabBar, IonTabButton, IonIcon, IonLabel, IonTabs, ModalController } from '@ionic/angular/standalone';
import { RegisterMovementModal } from 'src/app/features/movements/ui/modals/register-movement.modal/register-movement.modal.component';


@Component({
  selector: 'app-main-layout',
  standalone: true,
  templateUrl: './main-layout.component.html',
  styleUrls: ['./main-layout.component.scss'],
  imports: [IonTabBar, IonTabButton, IonIcon, IonLabel, IonTabs]
})
export class MainLayoutComponent {

private modalCtrl = inject(ModalController);

async openRegisterMovement() {
  const modal = await this.modalCtrl.create({
    component: RegisterMovementModal,
    cssClass: 'full-screen-modal',
    enterAnimation: undefined, // usa default de Ionic (slide)
    leaveAnimation: undefined,
    presentingElement: await this.modalCtrl.getTop(),

    showBackdrop: true,
    backdropDismiss: false,
  });

  await modal.present();
}

}
