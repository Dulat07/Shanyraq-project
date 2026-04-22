import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
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
export class FiltersComponent implements OnChanges, OnInit, OnDestroy {
  @Input() filters!: Filters;
  @Input() cities: string[] = [];
  @Output() filtersChange = new EventEmitter<Filters>();
  @Output() clear = new EventEmitter<void>();

  lang: 'en' | 'ru' = 'en';
  private formSubscription?: Subscription;

  filtersForm = this.fb.group({
    priceMin: this.fb.control<number | null>(null, [Validators.min(0)]),
    priceMax: this.fb.control<number | null>(null, [Validators.min(0)]),
    city: this.fb.control<string>(''),
    rooms: this.fb.control<number | null>(null),
    areaMin: this.fb.control<number | null>(null, [Validators.min(0)]),
    areaMax: this.fb.control<number | null>(null, [Validators.min(0)]),
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

  ngOnChanges(changes: SimpleChanges) {
    if (changes['filters']) {
      this.filtersForm.reset(this.toFormValue(this.filters || {}), { emitEvent: false });
    }
  }

  ngOnDestroy() {
    this.formSubscription?.unsubscribe();
  }

  sanitizeNumber(controlName: 'priceMin' | 'priceMax' | 'areaMin' | 'areaMax') {
    const control = this.filtersForm.controls[controlName];
    const value = control.value;

    if (value !== null && Number(value) < 0) {
      control.setValue(0);
    }
  }

  preventNegativeInput(event: KeyboardEvent) {
    if (event.key === '-' || event.key === 'Subtract') {
      event.preventDefault();
    }
  }

  clearFilters() {
    this.filtersForm.reset(this.toFormValue({}), { emitEvent: false });
    this.filtersService.reset();
    this.filtersChange.emit({});
    this.clear.emit();
  }

  private emitFilters() {
    this.normalizeNumericFilters();
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

  private normalizeNumericFilters() {
    (['priceMin', 'priceMax', 'areaMin', 'areaMax'] as const).forEach(controlName => {
      this.sanitizeNumber(controlName);
    });

    this.swapRangeIfNeeded('priceMin', 'priceMax');
    this.swapRangeIfNeeded('areaMin', 'areaMax');
  }

  private swapRangeIfNeeded(
    minControlName: 'priceMin' | 'areaMin',
    maxControlName: 'priceMax' | 'areaMax'
  ) {
    const minControl = this.filtersForm.controls[minControlName];
    const maxControl = this.filtersForm.controls[maxControlName];
    const minValue = minControl.value;
    const maxValue = maxControl.value;

    if (minValue !== null && maxValue !== null && Number(minValue) > Number(maxValue)) {
      minControl.setValue(Number(maxValue), { emitEvent: false });
      maxControl.setValue(Number(minValue), { emitEvent: false });
    }
  }

  private toFormValue(filters: Filters) {
    return {
      priceMin: filters.priceMin ?? null,
      priceMax: filters.priceMax ?? null,
      city: filters.city ?? '',
      rooms: filters.rooms ?? null,
      areaMin: filters.areaMin ?? null,
      areaMax: filters.areaMax ?? null,
      propertyType: filters.propertyType ?? '',
      furnished: filters.furnished === undefined ? '' : String(filters.furnished),
      parking: filters.parking === undefined ? '' : String(filters.parking),
      sortBy: filters.sortBy ?? ''
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
