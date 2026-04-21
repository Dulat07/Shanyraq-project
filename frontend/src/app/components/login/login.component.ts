import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { LanguageService } from '../../services/language.service';
import { tap } from 'rxjs';

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
  lang: 'en' | 'ru' = 'en';
  authMode: 'signin' | 'signup' = 'signin';

  constructor(
    private apiService: ApiService,
    private router: Router,
    private langService: LanguageService
  ) {
    this.lang = this.langService.currentLang;
    this.langService.lang$.subscribe(l => this.lang = l);
  }

  onLogin(): void {
    this.apiService.login({ username: this.username, password: this.password }).subscribe({
      next: () => this.router.navigate(['/home']),
      error: (err) => alert(this.lang === 'ru' ? 'Ошибка входа, проверьте ваши данные.' : 'Login failed, please check your credentials.')
    });
  }

  onAuthSubmit(): void {
    if (this.authMode === 'signup') {
      alert(this.lang === 'ru' ? 'Регистрация скоро будет доступна.' : 'Sign up will be available soon.');
      return;
    }

    this.onLogin();
  }

  setAuthMode(mode: 'signin' | 'signup'): void {
    this.authMode = mode;
  }
}
tap((res: any) => {
  if(res.token) {
    localStorage.setItem('token', res.token);
    localStorage.setItem('userId', res.user_id); // Сохраняем ID владельца
  }
})
