import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Listing } from '../../models/listing.model';
import { SearchComponent } from '../../components/search/search.component';
import { FiltersComponent } from '../../components/filters/filters.component';
import { Filters } from '../../models/filters.model'; 
import { ListingListComponent } from '../../components/listing-list/listing-list.component';
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
    ListingListComponent
  ],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  lang: 'en' | 'ru' = 'en';
  allListings: Listing[] = [];
  filteredListings: Listing[] = [];

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
      furnished: false,
      parking: false,
      sortBy: ''
    };
    this.searchQuery = '';
    this.propertyType = '';
    this.category = 'buy';
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