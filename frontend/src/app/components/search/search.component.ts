import { CommonModule } from '@angular/common';
import { Component, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { LanguageService } from '../../services/language.service';
import { SearchFocusService } from '../../services/search-focus.service';


@Component({
  selector: 'app-search',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit, OnDestroy {
  @ViewChild('searchInput') input!: ElementRef<HTMLInputElement>;

  lang: 'en' | 'ru' = 'en';
  private focusSubscription?: Subscription;

  constructor(
    private langService: LanguageService,
    private searchFocusService: SearchFocusService
  ) {
    this.lang = this.langService.currentLang;

    this.langService.lang$.subscribe(l => {
      this.lang = l;
    });
  }
  
  @Input() searchQuery = '';
  @Input() category: 'buy' | 'rent' = 'buy';
  @Input() propertyType = '';

  @Output() searchQueryChange = new EventEmitter<string>();
  @Output() categoryChange = new EventEmitter<'buy' | 'rent'>();
  @Output() propertyTypeChange = new EventEmitter<string>();

  ngOnInit() {
    this.focusSubscription = this.searchFocusService.focus$.subscribe(() => {
      this.focusInput();
    });
  }

  ngOnDestroy() {
    this.focusSubscription?.unsubscribe();
  }

  focusInput() {
    this.input.nativeElement.focus();
  }

  onCategorySelect(value: 'buy' | 'rent') {
    this.categoryChange.emit(value);
  }

  onQueryChange() {
    this.searchQueryChange.emit(this.searchQuery);
  }

  onTypeChange() {
    this.propertyTypeChange.emit(this.propertyType);
  }
}
