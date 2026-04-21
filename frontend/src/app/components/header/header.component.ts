import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { ChatService } from '../../services/chat.service';
import { LanguageService } from '../../services/language.service';
import { SearchFocusService } from '../../services/search-focus.service';


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
    private langService: LanguageService,
    private searchFocusService: SearchFocusService,
    private chatService: ChatService
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

  openMessages() {
    this.chatService.open({
      name: this.lang === 'ru' ? 'Сообщения' : 'Messages',
      avatar: 'https://ui-avatars.com/api/?name=Messages&background=d8e5e7&color=102a2d&bold=true'
    });
  }

  onSearchClick() {
    if (this.router.url !== '/home' && this.router.url !== '/') {
      this.router.navigate(['/home']).then(() => {
        setTimeout(() => this.searchFocusService.triggerFocus());
      });
      return;
    }

    this.searchFocusService.triggerFocus();
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
