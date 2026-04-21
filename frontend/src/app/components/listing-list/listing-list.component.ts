import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { Listing } from '../../models/listing.model';
import { ListingCardComponent } from '../listing-card/listing-card.component';
import { FavoritesService } from '../../services/favorites.service';
import { LanguageService } from '../../services/language.service';

@Component({
  selector: 'app-listing-list',
  standalone: true,
  imports: [CommonModule, ListingCardComponent],
  templateUrl: './listing-list.component.html',
  styleUrls: ['./listing-list.component.css']
})
export class ListingListComponent {

  @Input() listings: Listing[] = [];
  lang: 'en' | 'ru' = 'en';

  constructor(
    public fav: FavoritesService,
    private langService: LanguageService
  ) {
    this.lang = this.langService.currentLang;
    this.langService.lang$.subscribe(l => this.lang = l);
  }

}
