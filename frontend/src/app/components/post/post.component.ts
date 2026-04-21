import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Listing } from '../../models/listing.model';
import { LanguageService } from '../../services/language.service';

@Component({
  selector: 'app-post-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.css']
})
export class PostFormComponent {
  @Output() addListing = new EventEmitter<Listing>();
  lang: 'en' | 'ru' = 'en';

  constructor(private langService: LanguageService) {
    this.lang = this.langService.currentLang;
    this.langService.lang$.subscribe(l => this.lang = l);
  }

  form = {
    title: '',
    price: null as number | null,
    city: '',
    image: '',
    description: '',
    rooms: null as number | null,
    area: null as number | null,
    category: 'buy' as 'buy' | 'rent',
    type: 'Apartment' as 'Apartment' | 'House' | 'Commercial'
  };

  submitForm() {
    if (!this.form.title || !this.form.price || !this.form.city) return;

    const newListing: Listing = {
      id: Date.now(),
      title: this.form.title,
      price: this.form.price,
      city: this.form.city,
      image: this.form.image || 'https://images.unsplash.com/photo-1560185007-cde436f6a4d0?auto=format&fit=crop&w=1200&q=80',
      description: this.form.description || 'New listing added from frontend form.',
      rooms: this.form.rooms || 1,
      area: this.form.area || 40,
      category: this.form.category,
      type: this.form.type,
      furnished: false,
      parking: false,
      createdAt: new Date().toISOString()
    };

    this.addListing.emit(newListing);

    this.form = {
      title: '',
      price: null,
      city: '',
      image: '',
      description: '',
      rooms: null,
      area: null,
      category: 'buy',
      type: 'Apartment'
    };
  }
}
