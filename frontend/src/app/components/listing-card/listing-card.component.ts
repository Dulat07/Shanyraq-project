import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FavoritesService } from '../../services/favorites.service';
import { LanguageService } from '../../services/language.service';

@Component({
  selector: 'app-listing-card',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './listing-card.component.html',
  styleUrls: ['./listing-card.component.css']
})
export class ListingCardComponent {
  @Input() listing: any;

  lang: 'en' | 'ru' = 'en';

  constructor(
    public fav: FavoritesService,
    private langService: LanguageService
  ) {
    this.lang = this.langService.currentLang;

    this.langService.lang$.subscribe(l => {
      this.lang = l;
    });
  }
}
