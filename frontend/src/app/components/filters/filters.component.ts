import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { LanguageService } from '../../services/language.service';

export interface FilterState {
  minPrice: number | null;
  maxPrice: number | null;
  city: string;
  rooms: string;
  minArea: number | null;
  maxArea: number | null;
  furnished: string;
  parking: string;
  sortBy: string;
}

@Component({
  selector: 'app-filters',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './filters.component.html',
  styleUrls: ['./filters.component.css']
})
export class FiltersComponent {
  @Input() filters!: FilterState;
  @Input() cities: string[] = [];
  lang: 'en' | 'ru' = 'en';

  @Output() filtersChange = new EventEmitter<FilterState>();
  @Output() clear = new EventEmitter<void>();

  constructor(private langService: LanguageService) {
    this.lang = this.langService.currentLang;
    this.langService.lang$.subscribe(l => this.lang = l);
  }

  emitChanges() {
    this.filtersChange.emit({ ...this.filters });
  }

  clearFilters() {
    this.clear.emit();
  }
}
