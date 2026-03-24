import { Component, inject, OnInit } from '@angular/core';

import { IonContent, IonButton, IonInput, IonIcon } from '@ionic/angular/standalone';

import { FormsModule } from '@angular/forms';

import { Auth } from '@angular/fire/auth';
import { Router } from '@angular/router';

import { LoginUseCase } from '../../application/login.usecase';
import { SessionService } from 'src/app/core/session/session.service';
@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [FormsModule,IonContent, IonButton, IonInput, IonIcon],
})
export class LoginPage implements OnInit {

  email = '';
  password = '';
  showPassword = false;

  private loginUseCase = inject(LoginUseCase);
  private sessionService = inject(SessionService)

   constructor(
    private auth: Auth,
    private router: Router
  ) {}

  ngOnInit() {
  }

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  async login() {
    try {
      await this.loginUseCase.execute(this.email, this.password);

      // Inicializa en paralelo
      this.sessionService.initSession();

      await this.router.navigateByUrl('/home');

    } catch (error) {
      console.error(error);
    }
  }
  


}
