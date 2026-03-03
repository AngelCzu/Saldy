import { Component, inject, OnInit } from '@angular/core';

import { IonContent, IonButton, IonInput, IonIcon } from '@ionic/angular/standalone';

import { FormsModule } from '@angular/forms';

import { Auth } from '@angular/fire/auth';
import { Router } from '@angular/router';

import { LoginUseCase } from '../../application/login.usecase';
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
      await this.router.navigateByUrl('/home');
    } catch (error) {
      console.error(error);
    }
  }
  


}
