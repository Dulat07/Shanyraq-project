import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ListingCardComponent } from '../../listing-card/listing-card.component';
import { ApiService } from '../../../services/api.service';
import { LanguageService } from '../../../services/language.service';

@Component({
  selector: 'app-account-my-listings',
  standalone: true,
  imports: [CommonModule, RouterLink, ListingCardComponent],
  templateUrl: './my-listings.component.html',
  styleUrls: ['./account-tab.component.css']
})
export class MyListingsComponent implements OnInit {
  userListings: any[] = [];
  isLoading = true;
  error: string | null = null;
  lang: 'en' | 'ru' = 'en';

  constructor(
    private readonly apiService: ApiService,
    private readonly langService: LanguageService
  ) {
    this.lang = this.langService.currentLang;
    this.langService.lang$.subscribe((l) => this.lang = l);
  }

  ngOnInit(): void {
    this.loadUserProperties();
  }

  private loadUserProperties(): void {
    this.isLoading = true;
    this.error = null;

    this.apiService.getUserProperties().subscribe({
      next: (properties) => {
        this.userListings = properties.map((property) => this.mapPropertyToListing(property));
        this.isLoading = false;
      },
      error: (err) => {
        this.isLoading = false;
        this.error = err.message || 'Failed to load listings';
        console.error('Error loading user properties:', err);
      }
    });
  }

  private mapPropertyToListing(property: any): any {
    return {
      ...property,
      city: property.city || property.location || '',
      image: property.image || property.image_url || 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=1200&q=80',
      area: property.area || 0,
      type: property.type || this.getPropertyType(property.category),
      category: property.category?.name || property.category || '',
    };
  }

  private getPropertyType(category: any): string {
    const categoryName = String(category?.name || category || '').toLowerCase();

    if (categoryName.includes('commercial')) {
      return 'Commercial';
    }

    if (categoryName.includes('house')) {
      return 'House';
    }

    return 'Apartment';
  }
}
