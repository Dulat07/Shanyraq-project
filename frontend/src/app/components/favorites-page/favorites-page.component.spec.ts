import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FavoritesService } from '../../services/favorites.service';
import { ListingCardComponent } from '../listing-card/listing-card.component';

@Component({
  selector: 'app-favorites-page',
  standalone: true,
  imports: [CommonModule, ListingCardComponent],
  templateUrl: './favorites-page.component.html',
  styleUrls: ['./favorites-page.component.css']
})
export class FavoritesPageComponent {

  activeTab: 'favorites' | 'recent' = 'favorites';

  favorites: any[] = [];
  recent: any[] = []; // пока пусто, потом заполним

  constructor(private fav: FavoritesService) {
    this.load();
  }

  load() {
    this.favorites = this.fav.getFavorites();
  }

  setTab(tab: 'favorites' | 'recent') {
    this.activeTab = tab;
  }

  remove(property: any) {
    this.fav.toggle(property);
    this.load();
  }
}