import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ChatOverlayComponent } from './components/chat-overlay/chat-overlay.component';
import { HeaderComponent } from './components/header/header.component';
import { NotificationToastComponent } from './components/notification-toast/notification-toast.component';
import { LanguageService } from './services/language.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, ChatOverlayComponent, NotificationToastComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  lang: 'en' | 'ru' = 'en';

  constructor(private langService: LanguageService) {
    this.lang = this.langService.currentLang;
    this.langService.lang$.subscribe(l => this.lang = l);
  }
}
