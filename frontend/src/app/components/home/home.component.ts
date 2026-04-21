import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Filters } from '../../models/filters.model';
import { FiltersComponent } from '../../components/filters/filters.component';
import { ListingListComponent } from '../../components/listing-list/listing-list.component';
import { SearchComponent } from '../../components/search/search.component';
import { FiltersService } from '../../services/filters.service';
import { LanguageService } from '../../services/language.service';
import { ListingsService } from '../../services/listings.service';

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
export class HomeComponent {
  lang: 'en' | 'ru' = 'en';
  searchQuery = '';
  category: 'buy' | 'rent' = 'buy';
  propertyType = '';

  filteredListings$ = this.listingsService.filteredListings$;
  cities$ = this.listingsService.cities$;

  constructor(
    private filtersService: FiltersService,
    private listingsService: ListingsService,
    private langService: LanguageService
  ) {
    this.lang = this.langService.currentLang;

    this.langService.lang$.subscribe(l => {
      this.lang = l;
    });
  }

  onSearchQueryChange(value: string) {
    this.searchQuery = value;
    this.filtersService.updateSearch(value);
  }

  onCategoryChange(value: 'buy' | 'rent') {
    this.category = value;
    this.filtersService.updateCategory(value);
  }

  onTypeChange(value: string) {
    this.propertyType = value;
    this.filtersService.patchFilters({ propertyType: value || undefined });
  }

  onFiltersChange(filters: Filters) {
    this.propertyType = filters.propertyType || '';
  }
}
