import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Listing } from '../../models/listing.model';
import { SearchComponent } from '../../components/search/search.component';
import { FiltersComponent, FilterState } from '../../components/filters/filters.component';
import { ListingListComponent } from '../../components/listing-list/listing-list.component';

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
export class HomeComponent {
  searchQuery = '';
  category: 'buy' | 'rent' = 'buy';
  propertyType = '';

  filters: FilterState = {
    minPrice: null,
    maxPrice: null,
    city: '',
    rooms: '',
    minArea: null,
    maxArea: null,
    furnished: '',
    parking: '',
    sortBy: ''
  };

  allListings: Listing[] = [
    {
      id: 1,
      title: 'Modern apartment in Almaty',
      price: 85000,
      city: 'Almaty',
      image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80',
      description: 'Bright apartment near the city center with fresh renovation.',
      rooms: 2,
      area: 68,
      category: 'rent',
      type: 'Apartment',
      furnished: true,
      parking: true,
      createdAt: '2026-04-14'
    },
    {
      id: 2,
      title: 'Family house with yard',
      price: 320000,
      city: 'Astana',
      image: 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?auto=format&fit=crop&w=1200&q=80',
      description: 'Spacious house with a private yard and parking space.',
      rooms: 4,
      area: 180,
      category: 'buy',
      type: 'House',
      furnished: false,
      parking: true,
      createdAt: '2026-04-12'
    },
    {
      id: 3,
      title: 'Office space for startup',
      price: 140000,
      city: 'Almaty',
      image: 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1200&q=80',
      description: 'Commercial space in a business district, perfect for a small team.',
      rooms: 3,
      area: 95,
      category: 'rent',
      type: 'Commercial',
      furnished: true,
      parking: false,
      createdAt: '2026-04-10'
    },
    {
      id: 4,
      title: 'Cozy apartment near university',
      price: 62000,
      city: 'Shymkent',
      image: 'https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=1200&q=80',
      description: 'Affordable option for students and young professionals.',
      rooms: 1,
      area: 42,
      category: 'rent',
      type: 'Apartment',
      furnished: true,
      parking: false,
      createdAt: '2026-04-08'
    },
    {
      id: 5,
      title: 'Luxury penthouse with skyline view',
      price: 540000,
      city: 'Astana',
      image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80',
      description: 'Premium apartment with panoramic city view and designer interior.',
      rooms: 5,
      area: 210,
      category: 'buy',
      type: 'Apartment',
      furnished: true,
      parking: true,
      createdAt: '2026-04-15'
    },
    {
      id: 6,
      title: 'Townhouse in quiet area',
      price: 210000,
      city: 'Karaganda',
      image: 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1200&q=80',
      description: 'Comfortable townhouse with clean design and family layout.',
      rooms: 3,
      area: 130,
      category: 'buy',
      type: 'House',
      furnished: false,
      parking: true,
      createdAt: '2026-04-09'
    },
    {
      id: 7,
      title: 'Compact studio in city center',
      price: 50000,
      city: 'Almaty',
      image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=80',
      description: 'Minimal studio apartment close to cafes, metro, and offices.',
      rooms: 1,
      area: 34,
      category: 'rent',
      type: 'Apartment',
      furnished: true,
      parking: false,
      createdAt: '2026-04-13'
    },
    {
      id: 8,
      title: 'Retail space on main street',
      price: 280000,
      city: 'Aktobe',
      image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80',
      description: 'Commercial property with high foot traffic and strong visibility.',
      rooms: 2,
      area: 120,
      category: 'buy',
      type: 'Commercial',
      furnished: false,
      parking: true,
      createdAt: '2026-04-11'
    },
    {
      id: 9,
      title: 'Stylish apartment with balcony',
      price: 97000,
      city: 'Almaty',
      image: 'https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=1200&q=80',
      description: 'Modern apartment with balcony, bright kitchen, and easy access to transport.',
      rooms: 2,
      area: 74,
      category: 'rent',
      type: 'Apartment',
      furnished: true,
      parking: false,
      createdAt: '2026-04-16'
    },
    {
      id: 10,
      title: 'Minimal loft for young professionals',
      price: 110000,
      city: 'Astana',
      image: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80',
      description: 'Loft-style apartment with open plan interior and modern finishes.',
      rooms: 2,
      area: 81,
      category: 'rent',
      type: 'Apartment',
      furnished: true,
      parking: true,
      createdAt: '2026-04-17'
    },
    {
      id: 11,
      title: 'Large suburban family house',
      price: 390000,
      city: 'Shymkent',
      image: 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?auto=format&fit=crop&w=1200&q=80',
      description: 'Large private house with green yard, garage, and family-friendly layout.',
      rooms: 5,
      area: 240,
      category: 'buy',
      type: 'House',
      furnished: false,
      parking: true,
      createdAt: '2026-04-16'
    },
    {
      id: 12,
      title: 'Compact studio near downtown',
      price: 52000,
      city: 'Karaganda',
      image: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80',
      description: 'Budget-friendly studio ideal for one person, located near central streets.',
      rooms: 1,
      area: 33,
      category: 'rent',
      type: 'Apartment',
      furnished: true,
      parking: false,
      createdAt: '2026-04-18'
    },
    {
      id: 13,
      title: 'Premium office with meeting room',
      price: 310000,
      city: 'Almaty',
      image: 'https://images.unsplash.com/photo-1497366412874-3415097a27e7?auto=format&fit=crop&w=1200&q=80',
      description: 'Commercial office space with reception area, meeting room, and modern design.',
      rooms: 4,
      area: 150,
      category: 'buy',
      type: 'Commercial',
      furnished: true,
      parking: true,
      createdAt: '2026-04-18'
    },
    {
      id: 14,
      title: 'Two-floor townhouse with garage',
      price: 260000,
      city: 'Astana',
      image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80',
      description: 'Two-floor townhouse with private garage and cozy interior layout.',
      rooms: 4,
      area: 165,
      category: 'buy',
      type: 'House',
      furnished: false,
      parking: true,
      createdAt: '2026-04-19'
    },
    {
      id: 15,
      title: 'Small commercial unit for café',
      price: 135000,
      city: 'Aktobe',
      image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1200&q=80',
      description: 'Street-facing commercial unit suitable for café, bakery, or small retail.',
      rooms: 2,
      area: 88,
      category: 'rent',
      type: 'Commercial',
      furnished: false,
      parking: false,
      createdAt: '2026-04-19'
    },
    {
      id: 16,
      title: 'Cozy family apartment in quiet district',
      price: 145000,
      city: 'Shymkent',
      image: 'https://images.unsplash.com/photo-1493809842364-78817add7ffb?auto=format&fit=crop&w=1200&q=80',
      description: 'Comfortable apartment in a peaceful district with schools and shops nearby.',
      rooms: 3,
      area: 96,
      category: 'buy',
      type: 'Apartment',
      furnished: true,
      parking: true,
      createdAt: '2026-04-20'
    },
    {
      id: 17,
      title: 'Bright apartment with panoramic windows',
      price: 89000,
      city: 'Almaty',
      image: 'https://images.unsplash.com/photo-1502672023488-70e25813eb80?auto=format&fit=crop&w=1200&q=80',
      description: 'Sunny apartment with panoramic windows and clean modern interior.',
      rooms: 2,
      area: 70,
      category: 'rent',
      type: 'Apartment',
      furnished: true,
      parking: true,
      createdAt: '2026-04-20'
    },
    {
      id: 18,
      title: 'Retail showroom in busy district',
      price: 420000,
      city: 'Astana',
      image: 'https://images.unsplash.com/photo-1517502884422-41eaead166d4?auto=format&fit=crop&w=1200&q=80',
      description: 'High-visibility showroom space in a busy district with strong foot traffic.',
      rooms: 3,
      area: 170,
      category: 'buy',
      type: 'Commercial',
      furnished: false,
      parking: true,
      createdAt: '2026-04-21'
    }
  ];

  filteredListings: Listing[] = [...this.allListings];

  get cities(): string[] {
    return [...new Set(this.allListings.map(item => item.city))];
  }

  ngOnInit() {
    this.applyFilters();
  }

  onSearchQueryChange(value: string) {
    this.searchQuery = value;
    this.applyFilters();
  }

  onCategoryChange(value: 'buy' | 'rent') {
    this.category = value;
    this.applyFilters();
  }

  onTypeChange(value: string) {
    this.propertyType = value;
    this.applyFilters();
  }

  onFiltersChange(value: FilterState) {
    this.filters = value;
    this.applyFilters();
  }

  clearFilters() {
    this.filters = {
      minPrice: null,
      maxPrice: null,
      city: '',
      rooms: '',
      minArea: null,
      maxArea: null,
      furnished: '',
      parking: '',
      sortBy: ''
    };
    this.searchQuery = '';
    this.propertyType = '';
    this.category = 'buy';
    this.applyFilters();
  }

  addListing(listing: Listing) {
    this.allListings = [listing, ...this.allListings];
    this.applyFilters();
  }

  applyFilters() {
    let result = [...this.allListings];

    result = result.filter(item => item.category === this.category);

    if (this.searchQuery.trim()) {
      const query = this.searchQuery.toLowerCase();
      result = result.filter(item => item.title.toLowerCase().includes(query));
    }

    if (this.propertyType) {
      result = result.filter(item => item.type === this.propertyType);
    }

    if (this.filters.minPrice !== null) {
      result = result.filter(item => item.price >= this.filters.minPrice!);
    }

    if (this.filters.maxPrice !== null) {
      result = result.filter(item => item.price <= this.filters.maxPrice!);
    }

    if (this.filters.city) {
      result = result.filter(item => item.city === this.filters.city);
    }

    if (this.filters.rooms === '1') {
      result = result.filter(item => item.rooms === 1);
    }

    if (this.filters.rooms === '2') {
      result = result.filter(item => item.rooms === 2);
    }

    if (this.filters.rooms === '3') {
      result = result.filter(item => item.rooms === 3);
    }

    if (this.filters.rooms === '3+') {
      result = result.filter(item => item.rooms >= 3);
    }

    if (this.filters.minArea !== null) {
      result = result.filter(item => item.area >= this.filters.minArea!);
    }

    if (this.filters.maxArea !== null) {
      result = result.filter(item => item.area <= this.filters.maxArea!);
    }

    if (this.filters.furnished === 'yes') {
      result = result.filter(item => item.furnished);
    }

    if (this.filters.furnished === 'no') {
      result = result.filter(item => !item.furnished);
    }

    if (this.filters.parking === 'yes') {
      result = result.filter(item => item.parking);
    }

    if (this.filters.parking === 'no') {
      result = result.filter(item => !item.parking);
    }

    if (this.filters.sortBy === 'priceAsc') {
      result.sort((a, b) => a.price - b.price);
    }

    if (this.filters.sortBy === 'priceDesc') {
      result.sort((a, b) => b.price - a.price);
    }

    if (this.filters.sortBy === 'newest') {
      result.sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt));
    }

    this.filteredListings = result;
  }
}