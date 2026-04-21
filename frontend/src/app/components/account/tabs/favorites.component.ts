import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ListingCardComponent } from '../../listing-card/listing-card.component';
import { FavoritesService } from '../../../services/favorites.service';

@Component({
  selector: 'app-account-favorites',
  standalone: true,
  imports: [CommonModule, ListingCardComponent],
  templateUrl: './favorites.component.html',
  styleUrls: ['./account-tab.component.css']
})
export class AccountFavoritesComponent {
  favorites = this.favoritesService.getFavorites();

  constructor(private favoritesService: FavoritesService) {}
}
