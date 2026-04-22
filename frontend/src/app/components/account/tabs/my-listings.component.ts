import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ListingCardComponent } from '../../listing-card/listing-card.component';
import { ListingsService } from '../../../services/listings.service';
import { ApiService } from '../../../services/api.service';
import { Observable } from 'rxjs';
import { LanguageService } from '../../../services/language.service';

@Component({
  selector: 'app-account-my-listings',
  standalone: true,
  imports: [CommonModule, RouterLink, ListingCardComponent],
  templateUrl: './my-listings.component.html',
  styleUrls: ['./account-tab.component.css']
})
export class MyListingsComponent implements OnInit {
  listings$: Observable<any[]>;
  isLoading = true;
  error: string | null = null;
  publishingId: number | null = null;
  lang: 'en' | 'ru' = 'en';

  constructor(
    private listingsService: ListingsService,
    private apiService: ApiService,
    private langService: LanguageService
  ) {
    this.listings$ = this.listingsService.myListings$;
    this.lang = this.langService.currentLang;
    this.langService.lang$.subscribe(l => this.lang = l);
  }

  ngOnInit(): void {
    // Fetch user's properties from the backend
    this.apiService.getUserProperties().subscribe({
      next: (properties) => {
        this.isLoading = false;
      },
      error: (err) => {
        this.isLoading = false;
        this.error = err.message || 'Failed to load listings';
        console.error('Error loading user properties:', err);
      }
    });
  }

  isDeleted(property: any): boolean {
    return property.is_deleted === true;
  }

  isPublished(property: any): boolean {
    return property.is_published === true;
  }

  publishProperty(property: any, event: Event): void {
    event.stopPropagation();
    this.publishingId = property.id;
    this.apiService.publishProperty(property.id).subscribe({
      next: (updated) => {
        // Update the property in the list
        Object.assign(property, updated);
        this.publishingId = null;
      },
      error: (err) => {
        console.error('Error publishing property:', err);
        this.publishingId = null;
      }
    });
  }

  unpublishProperty(property: any, event: Event): void {
    event.stopPropagation();
    this.publishingId = property.id;
    this.apiService.unpublishProperty(property.id).subscribe({
      next: () => {
        property.is_published = false;
        this.publishingId = null;
      },
      error: (err) => {
        console.error('Error unpublishing property:', err);
        this.publishingId = null;
      }
    });
  }
}
