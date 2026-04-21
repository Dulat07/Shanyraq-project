import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Listing } from '../../models/listing.model';
import { FavoritesService } from '../../services/favorites.service';
import { LanguageService } from '../../services/language.service';
import { RecentService } from '../../services/recent.service';
import { ChatOverlayComponent } from '../chat-overlay/chat-overlay.component';
import { ChatService } from '../../services/chat.service';

@Component({
  selector: 'app-listing-details',
  standalone: true,
  imports: [CommonModule, ChatOverlayComponent],
  templateUrl: './listing-details.component.html',
  styleUrls: ['./listing-details.component.css']
})
export class ListingDetailsComponent implements OnInit {
  listing: Listing | null = null;
  lang: 'en' | 'ru' = 'en';
  showPhone = false;
  selectedImageIndex = 0;

  private allListings: Listing[] = [
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
      title: 'Small commercial unit for cafe',
      price: 135000,
      city: 'Aktobe',
      image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1200&q=80',
      description: 'Street-facing commercial unit suitable for cafe, bakery, or small retail.',
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

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    public fav: FavoritesService,
    private recent: RecentService,
    private chatService: ChatService,
    private langService: LanguageService
  ) {
    this.lang = this.langService.currentLang;
    this.langService.lang$.subscribe(l => this.lang = l);
  }

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    const stateListing = history.state?.listing as Listing | undefined;

    this.listing =
      stateListing?.id === id
        ? stateListing
        : this.allListings.find(item => item.id === id)
          || this.recent.getAll().find(item => item.id === id)
          || this.fav.getFavorites().find(item => item.id === id)
          || null;

    if (this.listing) {
      this.recent.add(this.listing);
    }
  }

  get gallery(): string[] {
    return this.listing ? [this.listing.image] : [];
  }

  get selectedImage(): string {
    return this.gallery[this.selectedImageIndex] || this.listing?.image || '';
  }

  get sellerName(): string {
    if (!this.listing) return '';
    return this.listing.type === 'Commercial' ? 'Business seller' : 'Property owner';
  }

  get sellerAvatar(): string {
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(this.sellerName)}&background=d8e5e7&color=102a2d&bold=true`;
  }

  get typeLabel(): string {
    if (!this.listing) return '';

    if (this.lang === 'ru') {
      return this.listing.type === 'Apartment'
        ? 'Квартира'
        : this.listing.type === 'House'
          ? 'Дом'
          : 'Коммерческая';
    }

    return this.listing.type;
  }

  get categoryLabel(): string {
    if (!this.listing) return '';

    return this.lang === 'ru'
      ? (this.listing.category === 'buy' ? 'Продажа' : 'Аренда')
      : (this.listing.category === 'buy' ? 'For sale' : 'For rent');
  }

  get detailsTags(): string[] {
    if (!this.listing) return [];

    return [
      `${this.listing.rooms} ${this.lang === 'ru' ? 'комнат' : 'rooms'}`,
      `${this.listing.area} m²`,
      this.typeLabel,
      this.categoryLabel,
      this.listing.furnished ? (this.lang === 'ru' ? 'С мебелью' : 'Furnished') : (this.lang === 'ru' ? 'Без мебели' : 'Unfurnished'),
      this.listing.parking ? (this.lang === 'ru' ? 'Парковка' : 'Parking') : (this.lang === 'ru' ? 'Без парковки' : 'No parking')
    ];
  }

  selectImage(index: number) {
    this.selectedImageIndex = index;
  }

  previousImage() {
    if (!this.gallery.length) return;
    this.selectedImageIndex = (this.selectedImageIndex - 1 + this.gallery.length) % this.gallery.length;
  }

  nextImage() {
    if (!this.gallery.length) return;
    this.selectedImageIndex = (this.selectedImageIndex + 1) % this.gallery.length;
  }

  togglePhone() {
    this.showPhone = !this.showPhone;
  }

  openChat() {
    this.chatService.open({
      name: this.sellerName,
      avatar: this.sellerAvatar
    });
  }

  goBack() {
    this.router.navigate(['/home']);
  }
}
