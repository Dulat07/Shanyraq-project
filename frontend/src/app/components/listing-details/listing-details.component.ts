import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Listing } from '../../models/listing.model';
import { FavoritesService } from '../../services/favorites.service';
import { LanguageService } from '../../services/language.service';
import { RecentService } from '../../services/recent.service';
import { ChatOverlayComponent } from '../chat-overlay/chat-overlay.component';
import { ChatService } from '../../services/chat.service';
import { ApiService } from '../../services/api.service'; 

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

  constructor(
    private  readonly route: ActivatedRoute,
    private readonly router: Router,
    public fav: FavoritesService,
    private readonly recent: RecentService,
    private readonly chatService: ChatService,
    private readonly langService: LanguageService,
    private readonly apiService: ApiService // Внедряем сервис
  ) {
    this.lang = this.langService.currentLang;
    this.langService.lang$.subscribe(l => this.lang = l);
  }

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    
    // Сначала проверяем, не передали ли нам объект через роутинг (history.state)
    const stateListing = history.state?.listing as Listing | undefined;

    if (stateListing?.id === id) {
      this.setListing(stateListing);
    } else {
      // ИСПРАВЛЕНИЕ I3: Если в state нет, запрашиваем с бэкенда
// Найди этот кусок кода в ngOnInit:
this.apiService.getProperty(id).subscribe({ // ИСПРАВЛЕНИЕ: было getProperties, стало getProperty
  next: (data: any) => {
    const mappedListing: Listing = {
      id: data.id,
      title: data.title,
      // ... весь остальной маппинг остается как был ...
      price: data.price,
      city: data.location,
      image: data.image_url || 'assets/default-home.jpg',
      description: data.description,
      rooms: data.rooms,
      area: data.area || 0,
      category: data.category?.toLowerCase() || 'buy',
      type: data.type || 'House',
      furnished: data.furnished || false,
      parking: data.parking || false,
      createdAt: data.created_at || new Date().toISOString()
    };
    this.setListing(mappedListing);
  },
  error: (err) => console.error('Ошибка загрузки объявления:', err)
});
    }
  }

  // Вспомогательный метод для сохранения
  private setListing(item: Listing) {
    this.listing = item;
    this.recent.add(item);
  }

  // ... (Остальные методы (gallery, typeLabel, etc.) остаются без изменений!) ...
  get gallery(): string[] { return this.listing ? [this.listing.image] : []; }
  get selectedImage(): string { return this.gallery[this.selectedImageIndex] || this.listing?.image || ''; }
  get sellerName(): string { return !this.listing ? '' : this.listing.type === 'Commercial' ? 'Business seller' : 'Property owner'; }
  get sellerAvatar(): string { return `https://ui-avatars.com/api/?name=${encodeURIComponent(this.sellerName)}&background=d8e5e7&color=102a2d&bold=true`; }
  
  get typeLabel(): string {
    if (!this.listing) return '';
    if (this.lang === 'ru') {
      return this.listing.type === 'Apartment' ? 'Квартира' : this.listing.type === 'House' ? 'Дом' : 'Коммерческая';
    }
    return this.listing.type;
  }

  get categoryLabel(): string {
    if (!this.listing) return '';
    return this.lang === 'ru' ? (this.listing.category === 'buy' ? 'Продажа' : 'Аренда') : (this.listing.category === 'buy' ? 'For sale' : 'For rent');
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

  selectImage(index: number) { this.selectedImageIndex = index; }
  previousImage() { if (!this.gallery.length) return; this.selectedImageIndex = (this.selectedImageIndex - 1 + this.gallery.length) % this.gallery.length; }
  nextImage() { if (!this.gallery.length) return; this.selectedImageIndex = (this.selectedImageIndex + 1) % this.gallery.length; }
  togglePhone() { this.showPhone = !this.showPhone; }
  openChat() { this.chatService.open({ name: this.sellerName, avatar: this.sellerAvatar }); }
  goBack() { this.router.navigate(['/home']); }
}