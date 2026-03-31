import { Component, inject, signal } from '@angular/core';
import { CommonModule, registerLocaleData } from '@angular/common';
import localeEsCL from '@angular/common/locales/es-CL';

import {
  AlertController,
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonIcon,
  IonTitle,
  IonToolbar,
  ModalController,
} from '@ionic/angular/standalone';

import { firstValueFrom, filter } from 'rxjs';
import { SessionService } from 'src/app/core/session/session.service';

import { RegisterMovementFacade } from '../../../application/register-movement.facade';
import { initialUiState, setLoading, UiState } from 'src/app/core/state/ui-state';
import { CategoriesFacade } from 'src/app/features/categories/application/categories.facade';
import { ToastService } from 'src/app/core/ui/toast.service';

import { RegisterMovementFormComponent } from '../../components/register-movement-form/register-movement-form.component';
import { SubmitMovementData } from '../../../models/submit-movement.model';

registerLocaleData(localeEsCL);

@Component({
  selector: 'app-register-movement-modal',
  standalone: true,
  templateUrl: './register-movement.modal.component.html',
  styleUrls: ['./register-movement.modal.component.scss'],
  imports: [
    CommonModule,
    IonContent,
    IonIcon,
    RegisterMovementFormComponent,
    IonButtons,
    IonButton,
    IonTitle,
    IonToolbar,
    IonHeader
  ],
})
export class RegisterMovementModal {

  private modalCtrl = inject(ModalController);
  private movementFacade = inject(RegisterMovementFacade);
  private categoriesFacade = inject(CategoriesFacade);
  private sessionService = inject(SessionService);
  private toast = inject(ToastService);
  private alertCtrl = inject(AlertController);

  state = signal<UiState<void>>(initialUiState());

  isFormDirty = false;

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
  //======== Loading =========
  //==========================


  get categories() {
    return this.categoriesFacade.state().data ?? [];
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


  //==========================
  //======== Submit ==========
  //==========================

  async handleSubmit(data: SubmitMovementData) {
    this.state.update(setLoading);

    try {
      await this.movementFacade.submitMovement(data);

      this.toast.success('Movimiento registrado correctamente');

      this.modalCtrl.dismiss(true);

    } catch {
      this.toast.error('Error al registrar el movimiento');
    }
  }

  async close() {
    if (this.isSubmitting) return;

    // Si no hay cambios → cerrar directo
    if (!this.isFormDirty) {
      this.modalCtrl.dismiss();
      return;
    }

    // Si hay cambios → mostrar alerta
    const alert = await this.alertCtrl.create({
      header: 'Salir sin guardar',
      message: 'Tienes cambios sin guardar. ¿Deseas salir?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
        },
        {
          text: 'Salir',
          role: 'destructive',
          handler: () => {
            this.modalCtrl.dismiss();
          }
        }
      ]
    });

    await alert.present();
  }
}