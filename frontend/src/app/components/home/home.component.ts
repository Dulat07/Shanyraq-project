import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Listing } from '../../models/listing.model';
import { SearchComponent } from '../../components/search/search.component';
import { FiltersComponent } from '../../components/filters/filters.component';
import { Filters } from '../../models/filters.model'; 
import { ListingListComponent } from '../../components/listing-list/listing-list.component';
import { ListingCardComponent } from '../../components/listing-card/listing-card.component';
import { LanguageService } from '../../services/language.service';
import { ApiService } from '../../services/api.service';
import { FiltersService } from '../../services/filters.service'; 

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    SearchComponent,
    FiltersComponent,
    ListingListComponent,
    ListingCardComponent
  ],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  lang: 'en' | 'ru' = 'en';
  allListings: Listing[] = [];
  filteredListings: Listing[] = [];
  recommendedListings: Listing[] = [
    {
      id: 1001,
      title: 'Modern apartment near Dostyk Plaza',
      price: 145000,
      city: 'Almaty',
      image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=900&q=80',
      description: 'Bright apartment with mountain views, updated finishes, and quick access to shops and cafes.',
      rooms: 3,
      area: 86,
      category: 'buy',
      type: 'Apartment',
      furnished: true,
      parking: true,
      createdAt: '2026-04-01T09:00:00.000Z'
    },
    {
      id: 1002,
      title: 'Family house with private yard',
      price: 230000,
      city: 'Astana',
      image: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=900&q=80',
      description: 'Spacious house for a growing family with a warm living room, garage, and garden space.',
      rooms: 5,
      area: 180,
      category: 'buy',
      type: 'House',
      furnished: false,
      parking: true,
      createdAt: '2026-04-02T09:00:00.000Z'
    },
    {
      id: 1003,
      title: 'Compact city studio',
      price: 68000,
      city: 'Shymkent',
      image: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=900&q=80',
      description: 'Efficient studio layout with natural light, ideal for students or first-time buyers.',
      rooms: 1,
      area: 38,
      category: 'buy',
      type: 'Apartment',
      furnished: true,
      parking: false,
      createdAt: '2026-04-03T09:00:00.000Z'
    },
    {
      id: 1004,
      title: 'Commercial space on a busy avenue',
      price: 310000,
      city: 'Almaty',
      image: 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=900&q=80',
      description: 'Street-level commercial property with large windows and strong foot traffic.',
      rooms: 4,
      area: 140,
      category: 'buy',
      type: 'Commercial',
      furnished: false,
      parking: true,
      createdAt: '2026-04-04T09:00:00.000Z'
    },
    {
      id: 1005,
      title: 'Cozy rental near the river',
      price: 900,
      city: 'Astana',
      image: 'https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=900&q=80',
      description: 'Comfortable rental apartment close to parks, transit, and daily essentials.',
      rooms: 2,
      area: 62,
      category: 'rent',
      type: 'Apartment',
      furnished: true,
      parking: false,
      createdAt: '2026-04-05T09:00:00.000Z'
    },
    {
      id: 1006,
      title: 'Suburban home with terrace',
      price: 175000,
      city: 'Karaganda',
      image: 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?auto=format&fit=crop&w=900&q=80',
      description: 'Quiet home with a terrace, flexible rooms, and plenty of outdoor space.',
      rooms: 4,
      area: 152,
      category: 'buy',
      type: 'House',
      furnished: false,
      parking: true,
      createdAt: '2026-04-06T09:00:00.000Z'
    },
    {
      id: 1007,
      title: 'New apartment in a residential complex',
      price: 118000,
      city: 'Almaty',
      image: 'https://images.unsplash.com/photo-1493809842364-78817add7ffb?auto=format&fit=crop&w=900&q=80',
      description: 'Fresh apartment in a secure complex with shared amenities and underground parking.',
      rooms: 2,
      area: 74,
      category: 'buy',
      type: 'Apartment',
      furnished: false,
      parking: true,
      createdAt: '2026-04-07T09:00:00.000Z'
    },
    {
      id: 1008,
      title: 'Office suite for a growing team',
      price: 1800,
      city: 'Astana',
      image: 'https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=900&q=80',
      description: 'Ready-to-use office suite with meeting areas and a practical central location.',
      rooms: 5,
      area: 110,
      category: 'rent',
      type: 'Commercial',
      furnished: true,
      parking: true,
      createdAt: '2026-04-08T09:00:00.000Z'
    },
    {
      id: 1009,
      title: 'Minimal apartment close to university',
      price: 72000,
      city: 'Kokshetau',
      image: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=900&q=80',
      description: 'Clean, practical apartment with easy maintenance and access to public transport.',
      rooms: 2,
      area: 48,
      category: 'buy',
      type: 'Apartment',
      furnished: true,
      parking: false,
      createdAt: '2026-04-09T09:00:00.000Z'
    },
    {
      id: 1010,
      title: 'Large house for multigenerational living',
      price: 265000,
      city: 'Almaty',
      image: 'https://images.unsplash.com/photo-1605276374104-dee2a0ed3cd6?auto=format&fit=crop&w=900&q=80',
      description: 'Generous house with multiple bedrooms, a calm neighborhood, and room for guests.',
      rooms: 6,
      area: 240,
      category: 'buy',
      type: 'House',
      furnished: false,
      parking: true,
      createdAt: '2026-04-10T09:00:00.000Z'
    }
  ];

  searchQuery = '';
  category: 'buy' | 'rent' = 'buy';
  propertyType = '';

  filters: Filters = {
    priceMin: undefined,
    priceMax: undefined,
    city: '',
    rooms: undefined,
    areaMin: undefined,
    areaMax: undefined,
    furnished: undefined,
    parking: undefined,
    sortBy: ''
  };

  constructor(
    private readonly langService: LanguageService,
    private readonly apiService: ApiService,
    private readonly filtersService: FiltersService 
  ) {
    this.lang = this.langService.currentLang;
    this.langService.lang$.subscribe(l => this.lang = l);
  }

  ngOnInit() {
    this.loadProperties();
  }

  loadProperties() {
    this.apiService.getProperties().subscribe({
      next: (data: any[]) => {
        this.allListings = data.map(item => ({
          id: item.id,
          title: item.title,
          price: item.price,
          city: item.location,
          image: item.image_url || 'assets/default-home.jpg',
          description: item.description,
          rooms: item.rooms,
          area: item.area || 0,
          category: item.category?.toLowerCase() || 'buy',
          type: item.type || 'House',
          furnished: item.furnished || false,
          parking: item.parking || false,
          createdAt: item.created_at || new Date().toISOString()
        }));
        this.applyFilters();
      },
      error: (err) => console.error('Ошибка загрузки данных:', err)
    });
  }

  // Геттер для городов (используется в HTML)
  get cities(): string[] {
    return [...new Set(this.allListings.map(item => item.city))];
  }

  onSearchQueryChange(value: string) {
    this.searchQuery = value;
    this.filtersService.updateSearch(value); 
    this.applyFilters(); 
  }

  onCategoryChange(value: 'buy' | 'rent') {
    this.category = value;
    this.filtersService.updateCategory(value);
    this.applyFilters();
  }

  onTypeChange(value: string) {
    this.propertyType = value;
    this.applyFilters();
  }

  onFiltersChange(value: Filters) {
    this.filters = value;
    this.applyFilters();
  }

  clearFilters() {
    this.filters = {
      priceMin: undefined,
      priceMax: undefined,
      city: '',
      rooms: undefined,
      areaMin: undefined,
      areaMax: undefined,
      propertyType: '',
      furnished: undefined,
      parking: undefined,
      sortBy: ''
    };
    this.searchQuery = '';
    this.propertyType = '';
    this.category = 'buy';
    this.filtersService.reset();
    this.applyFilters();
  }

  applyFilters() {
    let result = [...this.allListings];

    if (this.category) {
      result = result.filter(item => item.category === this.category);
    }

    if (this.searchQuery.trim()) {
      const query = this.searchQuery.toLowerCase();
      result = result.filter(item => item.title.toLowerCase().includes(query));
    }

    if (this.propertyType) {
      result = result.filter(item => item.type === this.propertyType);
    }

    if (this.filters.priceMin) result = result.filter(i => i.price >= this.filters.priceMin!);
    if (this.filters.priceMax) result = result.filter(i => i.price <= this.filters.priceMax!);
    if (this.filters.city) result = result.filter(i => i.city === this.filters.city);

    this.filteredListings = result;
  }
}
