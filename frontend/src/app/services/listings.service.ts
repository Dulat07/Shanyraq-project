import { Injectable } from '@angular/core';
import { BehaviorSubject, combineLatest, map } from 'rxjs';
import { Filters, ListingQuery } from '../models/filters.model';
import { Listing } from '../models/listing.model';
import { FiltersService } from './filters.service';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class ListingsService {
  private readonly listingsSubject = new BehaviorSubject<Listing[]>([
    {
      id: 1,
      ownerId: 'user-1',
      title: 'Modern apartment in Almaty',
      price: 85000,
      city: 'Almaty',
      image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80',
      description: 'Bright apartment near the city center with fresh renovation.',
      rooms: 2,
      area: 68,
      category: 'rent',
      type: 'Apartment',
      furnished: true,
      parking: true,
      createdAt: '2026-04-14'
    },
    {
      id: 2,
      ownerId: 'user-2',
      title: 'Family house with yard',
      price: 320000,
      city: 'Astana',
      image: 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?auto=format&fit=crop&w=1200&q=80',
      description: 'Spacious house with a private yard and parking space.',
      rooms: 4,
      area: 180,
      category: 'buy',
      type: 'House',
      furnished: false,
      parking: true,
      createdAt: '2026-04-12'
    },
    {
      id: 3,
      ownerId: 'user-1',
      title: 'Office space for startup',
      price: 140000,
      city: 'Almaty',
      image: 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1200&q=80',
      description: 'Commercial space in a business district, perfect for a small team.',
      rooms: 3,
      area: 95,
      category: 'rent',
      type: 'Commercial',
      furnished: true,
      parking: false,
      createdAt: '2026-04-10'
    },
    {
      id: 4,
      ownerId: 'user-3',
      title: 'Cozy apartment near university',
      price: 62000,
      city: 'Shymkent',
      image: 'https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=1200&q=80',
      description: 'Affordable option for students and young professionals.',
      rooms: 1,
      area: 42,
      category: 'rent',
      type: 'Apartment',
      furnished: true,
      parking: false,
      createdAt: '2026-04-08'
    },
    {
      id: 5,
      ownerId: 'user-2',
      title: 'Luxury penthouse with skyline view',
      price: 540000,
      city: 'Astana',
      image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80',
      description: 'Premium apartment with panoramic city view and designer interior.',
      rooms: 5,
      area: 210,
      category: 'buy',
      type: 'Apartment',
      furnished: true,
      parking: true,
      createdAt: '2026-04-15'
    },
    {
      id: 6,
      ownerId: 'user-1',
      title: 'Townhouse in quiet area',
      price: 210000,
      city: 'Karaganda',
      image: 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1200&q=80',
      description: 'Comfortable townhouse with clean design and family layout.',
      rooms: 3,
      area: 130,
      category: 'buy',
      type: 'House',
      furnished: false,
      parking: true,
      createdAt: '2026-04-09'
    },
    {
      id: 7,
      ownerId: 'user-3',
      title: 'Compact studio in city center',
      price: 50000,
      city: 'Almaty',
      image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=80',
      description: 'Minimal studio apartment close to cafes, metro, and offices.',
      rooms: 1,
      area: 34,
      category: 'rent',
      type: 'Apartment',
      furnished: true,
      parking: false,
      createdAt: '2026-04-13'
    },
    {
      id: 8,
      ownerId: 'user-2',
      title: 'Retail space on main street',
      price: 280000,
      city: 'Aktobe',
      image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80',
      description: 'Commercial property with high foot traffic and strong visibility.',
      rooms: 2,
      area: 120,
      category: 'buy',
      type: 'Commercial',
      furnished: false,
      parking: true,
      createdAt: '2026-04-11'
    }
  ]);

  listings$ = this.listingsSubject.asObservable();

  cities$ = this.listings$.pipe(
    map(listings => Array.from(new Set(listings.map(listing => listing.city))).sort())
  );

  filteredListings$ = combineLatest([
    this.listings$,
    this.filtersService.filters$,
    this.filtersService.query$
  ]).pipe(
    map(([listings, filters, query]) => this.applyFilters(listings, filters, query))
  );

  myListings$ = combineLatest([
    this.listings$,
    this.userService.currentUser$
  ]).pipe(
    map(([listings, user]) => listings.filter(listing => listing.ownerId === user.id))
  );

  constructor(
    private filtersService: FiltersService,
    private userService: UserService
  ) {}

  addListing(listing: Listing) {
    this.listingsSubject.next([listing, ...this.listingsSubject.value]);
  }

  getById(id: number): Listing | undefined {
    return this.listingsSubject.value.find(listing => listing.id === id);
  }

  private applyFilters(listings: Listing[], filters: Filters, query: ListingQuery): Listing[] {
    const searchQuery = query.searchQuery.trim().toLowerCase();

    let result = listings.filter(listing => listing.category === query.category);

    if (searchQuery) {
      result = result.filter(listing => listing.title.toLowerCase().includes(searchQuery));
    }

    if (filters.propertyType) {
      result = result.filter(listing => listing.type === filters.propertyType);
    }

    if (filters.priceMin !== undefined) {
      result = result.filter(listing => listing.price >= filters.priceMin!);
    }

    if (filters.priceMax !== undefined) {
      result = result.filter(listing => listing.price <= filters.priceMax!);
    }

    if (filters.city) {
      result = result.filter(listing => listing.city === filters.city);
    }

    if (filters.rooms !== undefined) {
      result = result.filter(listing => listing.rooms === filters.rooms);
    }

    if (filters.areaMin !== undefined) {
      result = result.filter(listing => listing.area >= filters.areaMin!);
    }

    if (filters.areaMax !== undefined) {
      result = result.filter(listing => listing.area <= filters.areaMax!);
    }

    if (filters.furnished !== undefined) {
      result = result.filter(listing => listing.furnished === filters.furnished);
    }

    if (filters.parking !== undefined) {
      result = result.filter(listing => listing.parking === filters.parking);
    }

    return this.sortListings(result, filters.sortBy);
  }

  private sortListings(listings: Listing[], sortBy?: string): Listing[] {
    const sorted = [...listings];

    if (sortBy === 'priceAsc') {
      return sorted.sort((a, b) => a.price - b.price);
    }

    if (sortBy === 'priceDesc') {
      return sorted.sort((a, b) => b.price - a.price);
    }

    if (sortBy === 'newest') {
      return sorted.sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt));
    }

    return sorted;
  }
}
