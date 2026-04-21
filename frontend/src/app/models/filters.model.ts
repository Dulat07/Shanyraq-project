export interface Filters {
  priceMin?: number;
  priceMax?: number;
  city?: string;
  rooms?: number;
  areaMin?: number;
  areaMax?: number;
  propertyType?: string;
  furnished?: boolean;
  parking?: boolean;
  sortBy?: string;
}

export interface ListingQuery {
  searchQuery: string;
  category: 'buy' | 'rent';
}
