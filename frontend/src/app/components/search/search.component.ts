import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent {
  @Input() searchQuery = '';
  @Input() category: 'buy' | 'rent' = 'buy';
  @Input() propertyType = '';

  @Output() searchQueryChange = new EventEmitter<string>();
  @Output() categoryChange = new EventEmitter<'buy' | 'rent'>();
  @Output() propertyTypeChange = new EventEmitter<string>();

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