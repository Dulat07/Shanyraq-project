import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FavoritesService } from '../../services/favorites.service';
import { LanguageService } from '../../services/language.service';


@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  isLoggedIn = false;

  lang: 'en' | 'ru' = 'en';

  constructor(
    private router: Router,
    public fav: FavoritesService,
    private langService: LanguageService
  ) {
    this.lang = this.langService.currentLang;

    this.langService.lang$.subscribe(l => {
      this.lang = l;
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
    this.isLoggedIn = false;
  }
}