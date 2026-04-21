import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FavoritesService } from '../../services/favorites.service';
import { ListingCardComponent } from '../listing-card/listing-card.component';
import { LanguageService } from '../../services/language.service';
import { RecentService } from '../../services/recent.service';

@Component({
  selector: 'app-favorites-page',
  standalone: true,
  imports: [CommonModule, ListingCardComponent],
  templateUrl: './favorites-page.component.html',
  styleUrls: ['./favorites-page.component.css']
})
export class FavoritesPageComponent {

  activeTab: 'favorites' | 'recent' = 'favorites';
  lang: 'en' | 'ru' = 'en';

  favorites: any[] = [];
  recent: any[] = [];

  constructor(
    private fav: FavoritesService,
    private langService: LanguageService,
    private recentService: RecentService
  ) {
    this.lang = this.langService.currentLang;
    this.langService.lang$.subscribe(l => this.lang = l);
    this.load();
  }

  load() {
    this.favorites = this.fav.getFavorites();
    this.recent = this.recentService.getAll();
  }

  setTab(tab: 'favorites' | 'recent') {
    this.activeTab = tab;
    this.load();
  }

  remove(property: any) {
    this.fav.toggle(property);
    this.load();
  }
}
