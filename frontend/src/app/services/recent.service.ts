import { Injectable } from '@angular/core';
import { Listing } from '../models/listing.model';

@Injectable({
  providedIn: 'root'
})
export class RecentService {
  private key = 'recentlyViewed';

  add(listing: Listing) {
    const recent = this.getAll().filter(item => item.id !== listing.id);
    recent.unshift(listing);
    localStorage.setItem(this.key, JSON.stringify(recent.slice(0, 12)));
  }

  getAll(): Listing[] {
    return JSON.parse(localStorage.getItem(this.key) || '[]');
  }
}
