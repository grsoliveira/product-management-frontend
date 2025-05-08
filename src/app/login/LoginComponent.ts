import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { PasswordModule } from 'primeng/password';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import {AuthService} from '../service/AuthService';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    InputTextModule,
    ButtonModule,
    PasswordModule,
    ToastModule
  ],
  template: `
    <p-toast></p-toast>
    <div class="flex align-items-center justify-content-center min-h-screen">
      <div class="surface-card p-4 shadow-2 border-round w-full lg:w-4">
        <h2 class="text-center mb-4">Login</h2>
        <div class="flex flex-column gap-3">
          <div class="field">
            <label for="username">User</label>
            <input
              id="username"
              pInputText
              [(ngModel)]="username"
              class="w-full"
              (keyup.enter)="login()"
            />
          </div>
          <div class="field">
            <label for="password">Password</label>
            <p-password
              id="password"
              [(ngModel)]="password"
              [toggleMask]="true"
              [feedback]="false"
              class="w-full"
              (keyup.enter)="login()"
            ></p-password>
          </div>
          <p-button
            label="Enter"
            (click)="login()"
            [loading]="loading"
            class="w-full"
          ></p-button>
        </div>
      </div>
    </div>
  `
})
export class LoginComponent {
  username: string = '';
  password: string = '';
  loading: boolean = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private messageService: MessageService
  ) {}

  login() {
    if (!this.username || !this.password) {
      this.messageService.add({
        severity: 'error',
        summary: 'Erro',
        detail: 'Fill all fields',
        life: 3000
      });
      return;
    }

    this.loading = true;
    this.authService.login(this.username, this.password).subscribe({
      next: () => {
        this.router.navigate(['/']);
      },
      error: (error) => {
        let message = 'Error on login';
        if (error.status === 401) {
          message = 'User or password invalid';
        }
        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: message,
          life: 3000
        });
        this.loading = false;
      }
    });
  }
}
