import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core'; // Добавили OnInit
import { Router, RouterLink } from '@angular/router';
import { FavoritesService } from '../../services/favorites.service';
import { LanguageService } from '../../services/language.service';
import { ApiService } from '../../services/api.service'; // Импорт сервиса

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  isLoggedIn = false;
  lang: 'en' | 'ru' = 'en';

  constructor(
    private router: Router,
    public fav: FavoritesService,
    private langService: LanguageService,
    private apiService: ApiService // Внедряем ApiService
  ) {
    this.lang = this.langService.currentLang;
    this.langService.lang$.subscribe(l => this.lang = l);
  }

  ngOnInit(): void {
    // ИСПРАВЛЕНИЕ C6: Следим за статусом авторизации в реальном времени
    this.apiService.isLoggedIn$.subscribe(status => {
      this.isLoggedIn = status;
    });
  }

  setLang(language: 'en' | 'ru') {
    this.langService.setLang(language);
  }

  goToHome() {
    this.router.navigate(['/']);
  }

  scrollToAbout() {
    if (this.router.url !== '/') {
      this.router.navigate(['/']).then(() => {
        setTimeout(() => {
          this.scrollIntoAboutSection();
        }, 150);
      });
      return;
    }
    this.scrollIntoAboutSection();
  }

  private scrollIntoAboutSection() {
    const aboutSection = document.getElementById('about');
    if (!aboutSection) return;

    const headerOffset = 100;
    const elementPosition = aboutSection.getBoundingClientRect().top + window.scrollY;
    const offsetPosition = elementPosition - headerOffset;

    window.scrollTo({
      top: offsetPosition,
      behavior: 'smooth'
    });
  }

  logout() {
    // ИСПРАВЛЕНИЕ C7: Удаляем токен через сервис и уходим на логин
    this.apiService.logout();
    this.router.navigate(['/login']);
  }
}