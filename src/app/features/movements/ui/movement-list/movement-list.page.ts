import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';

import { Movement } from 'src/app/domain/entities/movement.entity';
import { ListMovementsUseCase } from '../../application/list-movements.usecase';


@Component({
  selector: 'app-movement-list',
  standalone: true,
  imports: [CommonModule, IonicModule],
  templateUrl: './movement-list.page.html',
  styleUrls: ['./movement-list.page.scss'],
})
export class MovementListPage {

  movements: Movement[] = [];
  loading = true;

  constructor(
    @Inject('LIST_MOVEMENTS')
    private listMovements: ListMovementsUseCase
  ) {}

    async ionViewWillEnter() {
        this.loading = true;

        try {
            this.movements = await this.listMovements.execute();
        } catch (error) {
            console.error('Error cargando movimientos', error);
        } finally {
            this.loading = false;
        }
    }

}
