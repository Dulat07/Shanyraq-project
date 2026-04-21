import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Filters, ListingQuery } from '../models/filters.model';

@Injectable({
  providedIn: 'root'
})
export class FiltersService {
  private readonly filtersSubject = new BehaviorSubject<Filters>({});
  private readonly querySubject = new BehaviorSubject<ListingQuery>({
    searchQuery: '',
    category: 'buy'
  });

  filters$ = this.filtersSubject.asObservable();
  query$ = this.querySubject.asObservable();

  get currentFilters(): Filters {
    return this.filtersSubject.value;
  }

  get currentQuery(): ListingQuery {
    return this.querySubject.value;
  }

  setFilters(filters: Filters) {
    this.filtersSubject.next(filters);
  }

  patchFilters(filters: Partial<Filters>) {
    this.filtersSubject.next({
      ...this.filtersSubject.value,
      ...filters
    });
  }

  updateSearch(searchQuery: string) {
    this.querySubject.next({
      ...this.querySubject.value,
      searchQuery
    });
  }

  updateCategory(category: 'buy' | 'rent') {
    this.querySubject.next({
      ...this.querySubject.value,
      category
    });
  }

  reset() {
    this.filtersSubject.next({});
    this.querySubject.next({
      searchQuery: '',
      category: 'buy'
    });
  }
}
