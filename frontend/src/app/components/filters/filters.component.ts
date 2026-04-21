import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Filters } from '../../models/filters.model';
import { FiltersService } from '../../services/filters.service';
import { LanguageService } from '../../services/language.service';

@Component({
  selector: 'app-filters',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './filters.component.html',
  styleUrls: ['./filters.component.css']
})
export class FiltersComponent implements OnInit, OnDestroy {
  @Input() filters!: Filters;
  @Input() cities: string[] = [];
  @Output() filtersChange = new EventEmitter<Filters>();
  @Output() clear = new EventEmitter<void>();

  lang: 'en' | 'ru' = 'en';
  private formSubscription?: Subscription;

  filtersForm = this.fb.group({
    priceMin: this.fb.control<number | null>(null),
    priceMax: this.fb.control<number | null>(null),
    city: this.fb.control<string>(''),
    rooms: this.fb.control<number | null>(null),
    areaMin: this.fb.control<number | null>(null),
    areaMax: this.fb.control<number | null>(null),
    propertyType: this.fb.control<string>(''),
    furnished: this.fb.control<string>(''),
    parking: this.fb.control<string>(''),
    sortBy: this.fb.control<string>('')
  });

  constructor(
    private fb: FormBuilder,
    private filtersService: FiltersService,
    private langService: LanguageService
  ) {
    this.lang = this.langService.currentLang;
    this.langService.lang$.subscribe(l => this.lang = l);
  }

  ngOnInit() {
    this.formSubscription = this.filtersForm.valueChanges.subscribe(() => {
      this.emitFilters();
    });
  }

  ngOnDestroy() {
    this.formSubscription?.unsubscribe();
  }

  clearFilters() {
    this.filtersForm.reset({
      priceMin: null,
      priceMax: null,
      city: '',
      rooms: null,
      areaMin: null,
      areaMax: null,
      propertyType: '',
      furnished: '',
      parking: '',
      sortBy: ''
    });
  }

  private emitFilters() {
    const filters = this.toFiltersDto();
    this.filtersService.setFilters(filters);
    this.filtersChange.emit(filters);
  }

  private toFiltersDto(): Filters {
    const value = this.filtersForm.getRawValue();

    return {
      priceMin: this.optionalNumber(value.priceMin),
      priceMax: this.optionalNumber(value.priceMax),
      city: value.city || undefined,
      rooms: this.optionalNumber(value.rooms),
      areaMin: this.optionalNumber(value.areaMin),
      areaMax: this.optionalNumber(value.areaMax),
      propertyType: value.propertyType || undefined,
      furnished: this.optionalBoolean(value.furnished),
      parking: this.optionalBoolean(value.parking),
      sortBy: value.sortBy || undefined
    };
  }

  private optionalNumber(value: number | null): number | undefined {
    return value === null ? undefined : Number(value);
  }

  private optionalBoolean(value: string | null): boolean | undefined {
    if (value === 'true') return true;
    if (value === 'false') return false;
    return undefined;
  }
}
