import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { LanguageService } from '../../services/language.service';
import { NotificationService } from '../../services/notification.service';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  username = '';
  password = '';
  email = '';

  lang: 'en' | 'ru' = 'en';
  authMode: 'signin' | 'signup' = 'signin';

  isLoading = false;
  errorMsg = '';

  constructor(
    private readonly apiService: ApiService,
    private readonly router: Router,
    private readonly langService: LanguageService,
    private readonly notificationService: NotificationService,
    private readonly userService: UserService
  ) {
    this.lang = this.langService.currentLang;
    this.langService.lang$.subscribe((l) => this.lang = l);
  }

  setAuthMode(mode: 'signin' | 'signup'): void {
    this.authMode = mode;
    this.errorMsg = '';
    this.username = '';
    this.password = '';
    this.email = '';
  }

  onAuthSubmit(): void {
    this.errorMsg = '';

    if (!this.username.trim() || !this.password.trim()) {
      const msg = this.lang === 'ru'
        ? 'Заполните все обязательные поля.'
        : 'Please fill in all required fields.';
      this.notificationService.show(msg);
      return;
    }

    if (this.authMode === 'signup') {
      this.onRegister();
    } else {
      this.onLogin();
    }
  }

  private onLogin(): void {
    this.isLoading = true;

    this.apiService.login({ username: this.username, password: this.password }).subscribe({
      next: () => {
        this.userService.loadCurrentUser();
        this.router.navigate(['/home']);
      },
      error: () => {
        this.isLoading = false;
        const msg = this.lang === 'ru'
          ? 'Неверный логин или пароль.'
          : 'Invalid username or password.';
        this.notificationService.show(msg);
      }
    });
  }

  private onRegister(): void {
    this.isLoading = true;

    const payload: { username: string; password: string; email?: string } = {
      username: this.username,
      password: this.password,
    };

    if (this.email.trim()) {
      payload.email = this.email.trim();
    }

    this.apiService.register(payload).subscribe({
      next: () => {
        this.userService.loadCurrentUser();
        this.router.navigate(['/home']);
      },
      error: (err: Error) => {
        this.isLoading = false;
        const msg = err.message?.includes('already')
          ? (this.lang === 'ru' ? 'Это имя пользователя уже занято.' : 'Username is already taken.')
          : (this.lang === 'ru' ? 'Ошибка регистрации. Попробуйте ещё раз.' : 'Registration failed. Please try again.');
        this.notificationService.show(msg);
      }
    });
  }
}
