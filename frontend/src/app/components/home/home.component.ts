import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Listing } from '../../models/listing.model';
import { SearchComponent } from '../../components/search/search.component';
import { FiltersComponent, FilterState } from '../../components/filters/filters.component';
import { ListingListComponent } from '../../components/listing-list/listing-list.component';
import { LanguageService } from '../../services/language.service';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    SearchComponent,
    FiltersComponent,
    ListingListComponent,
  ],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  lang: 'en' | 'ru' = 'en';
  allListings: Listing[] = [];
  filteredListings: Listing[] = [];

  // Состояния фильтров
  searchQuery = '';
  category: 'buy' | 'rent' = 'buy';
  propertyType = ''; // ДОБАВИЛИ ЭТУ ПЕРЕМЕННУЮ

  filters: FilterState = {
    minPrice: null, maxPrice: null, city: '', rooms: '',
    minArea: null, maxArea: null, furnished: '', parking: '', sortBy: ''
  };

  constructor(
    private langService: LanguageService,
    private apiService: ApiService
  ) {
    this.lang = this.langService.currentLang;
    this.langService.lang$.subscribe(l => this.lang = l);
  }

  ngOnInit() {
    this.loadProperties();
  }

  loadProperties() {
    // В api.service.ts мы уже убрали аргумент (id: number), теперь ошибки тут не будет
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

  get cities(): string[] {
    return [...new Set(this.allListings.map(item => item.city))];
  }

  // --- ИСПРАВЛЕНИЯ ОШИБОК NG9 (Методы) ---

  onSearchQueryChange(value: string) {
    this.searchQuery = value;
    this.applyFilters();
  }

  onCategoryChange(value: 'buy' | 'rent') {
    this.category = value;
    this.applyFilters();
  }

  onTypeChange(value: string) { // ДОБАВИЛИ ЭТОТ МЕТОД
    this.propertyType = value;
    this.applyFilters();
  }

  onFiltersChange(value: FilterState) {
    this.filters = value;
    this.applyFilters();
  }

  clearFilters() { // ДОБАВИЛИ ЭТОТ МЕТОД
    this.filters = {
      minPrice: null, maxPrice: null, city: '', rooms: '',
      minArea: null, maxArea: null, furnished: '', parking: '', sortBy: ''
    };
    this.searchQuery = '';
    this.propertyType = '';
    this.category = 'buy';
    this.applyFilters();
  }

  applyFilters() {
    let result = [...this.allListings];

    // 1. Фильтр по категории
    //result = result.filter(item => item.category === this.category);

    // 2. Поиск по названию
    if (this.searchQuery.trim()) {
      const query = this.searchQuery.toLowerCase();
      result = result.filter(item => item.title.toLowerCase().includes(query));
    }

    // 3. Фильтр по типу (Квартира/Дом)
    if (this.propertyType) {
      result = result.filter(item => item.type === this.propertyType);
    }

    // 4. Фильтры по цене
    if (this.filters.minPrice !== null) result = result.filter(i => i.price >= this.filters.minPrice!);
    if (this.filters.maxPrice !== null) result = result.filter(i => i.price <= this.filters.maxPrice!);

    // 5. Фильтр по городу
    if (this.filters.city) result = result.filter(i => i.city === this.filters.city);

    // 6. Сортировка
    if (this.filters.sortBy === 'priceAsc') result.sort((a, b) => a.price - b.price);
    if (this.filters.sortBy === 'priceDesc') result.sort((a, b) => b.price - a.price);

    this.filteredListings = result;
  }
}