import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router'; // Добавили для перехода после создания
import { LanguageService } from '../../services/language.service';
import { ApiService } from '../../services/api.service'; // Наш мост к Django

@Component({
  selector: 'app-post-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.css']
})
export class PostFormComponent {
  // ИСПРАВЛЕНИЕ I4: Удалили @Output, так как страница самостоятельная
  lang: 'en' | 'ru' = 'en';

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

  constructor(
        private readonly langService: LanguageService,
        private readonly apiService: ApiService, // Внедряем сервис
        private readonly router: Router          // Внедряем роутер
  ) {
    this.lang = this.langService.currentLang;
    this.langService.lang$.subscribe(l => this.lang = l);
  }

  submitForm() {
    if (!this.form.title || !this.form.price || !this.form.city) {
      alert(this.lang === 'ru' ? 'Пожалуйста, заполните основные поля' : 'Please fill in the required fields');
      return;
    }

    // ИСПРАВЛЕНИЕ I2 & I4: Маппинг данных под модель Django
    const propertyData = {
      title: this.form.title,
      description: this.form.description || 'No description provided',
      price: this.form.price,
      rooms: this.form.rooms || 1,
      location: this.form.city,       // В Django поле называется location
      image_url: this.form.image,     // В Django поле называется image_url
      category: this.form.category,
      area: this.form.area || 0,
      is_available: true
    };

    // Отправляем на бэкенд
    this.apiService.createProperty(propertyData).subscribe({
      next: (res) => {
        console.log('Объявление создано:', res);
          alert(this.lang === 'ru' ? 'Объявление успешно опубликовано!' : 'Listing published successfully!');
        this.router.navigate(['/home']);
      },
      error: (err) => {
        console.error('Ошибка при создании:', err);
        alert(this.lang === 'ru' ? 'Ошибка при публикации. Проверьте авторизацию.' : 'Publishing failed. Check your authorization.');
      }
    });
  }
}