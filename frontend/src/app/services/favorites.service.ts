import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class FavoritesService {

  private key = 'favorites';

  getFavorites(): any[] {
    return JSON.parse(localStorage.getItem(this.key) || '[]');
  }

  toggle(property: any) {
    let favorites = this.getFavorites();

    const index = favorites.findIndex(p => p.id === property.id);

    if (index > -1) {
      favorites.splice(index, 1);
    } else {
      favorites.push(property);
    }

    localStorage.setItem(this.key, JSON.stringify(favorites));
  }

  isFavorite(property: any): boolean {
    return this.getFavorites().some(p => p.id === property.id);
  }
}