import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router'; 
import { LanguageService } from '../../services/language.service';
import { ApiService } from '../../services/api.service'; 

@Component({
  selector: 'app-post-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.css']
})
export class PostFormComponent {
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
    private readonly apiService: ApiService,
    private readonly router: Router
  ) {
    this.lang = this.langService.currentLang;
    this.langService.lang$.subscribe(l => this.lang = l);
  }

  submitForm() {
    // 1. Валидация
    if (!this.form.title || !this.form.price || !this.form.city) {
      alert(this.lang === 'ru' ? 'Пожалуйста, заполните основные поля' : 'Please fill in the required fields');
      return;
    }

    // 2. Получаем ID владельца (как мы делали в Postman)
    const userId = localStorage.getItem('userId') || '2'; 

    // 3. Маппинг данных под Django
    const propertyData = {
      title: this.form.title,
      description: this.form.description || 'No description provided',
      price: this.form.price,
      rooms: this.form.rooms || 1,
      location: this.form.city,      // В Django это location
      image_url: this.form.image,    // В Django это image_url
      category: this.form.category,
      type: this.form.type,          // Apartment/House/Commercial
      area: this.form.area || 0,
      owner: parseInt(userId),       // Наш заветный owner из Postman
      is_available: true
    };

    console.log('Отправляем на сервер:', propertyData);

    // 4. Отправка
    this.apiService.createProperty(propertyData).subscribe({
      next: (res) => {
        console.log('Успех:', res);
        alert(this.lang === 'ru' ? 'Объявление успешно опубликовано!' : 'Listing published successfully!');
        this.router.navigate(['/home']);
      },
      error: (err) => {
        console.error('Ошибка:', err);
        // Если видишь эту ошибку — проверь 'Token' вместо 'Bearer' в api.service.ts
        alert(this.lang === 'ru' ? 'Ошибка публикации. Проверьте авторизацию.' : 'Publishing failed. Check authorization.');
      }
    });
  }
}