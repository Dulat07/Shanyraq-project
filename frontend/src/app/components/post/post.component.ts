import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { LanguageService } from '../../services/language.service';

type ListingImage = {
  file: File;
  preview: string;
};

@Component({
  selector: 'app-post-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.css']
})
export class PostFormComponent {
  lang: 'en' | 'ru' = 'en';
  images: ListingImage[] = [];

  form = {
    title: '',
    price: null as number | null,
    city: '',
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
    this.langService.lang$.subscribe(lang => this.lang = lang);
  }

  submitForm() {
    if (!this.form.title || !this.form.price || !this.form.city) {
      alert(this.lang === 'ru' ? 'Пожалуйста, заполните основные поля' : 'Please fill in the required fields');
      return;
    }

    this.apiService.createProperty(this.createListingFormData()).subscribe({
      next: () => {
        alert(this.lang === 'ru' ? 'Объявление успешно опубликовано!' : 'Listing published successfully!');
        this.resetForm();
        this.router.navigate(['/home']);
      },
      error: (err) => {
        console.error('Publishing failed:', err);
        alert(this.lang === 'ru' ? 'Ошибка публикации. Проверьте авторизацию.' : 'Publishing failed. Check authorization.');
      }
    });
  }

  onFileSelect(event: Event) {
    const input = event.target as HTMLInputElement;
    this.addFiles(input.files);
    input.value = '';
  }

  onDragOver(event: DragEvent) {
    event.preventDefault();
  }

  onDrop(event: DragEvent) {
    event.preventDefault();
    this.addFiles(event.dataTransfer?.files ?? null);
  }

  removeImage(index: number) {
    this.images.splice(index, 1);
  }

  private addFiles(files: FileList | null) {
    if (!files) return;

    Array.from(files)
      .filter(file => file.type.startsWith('image/'))
      .forEach(file => {
        const reader = new FileReader();

        reader.onload = (event: ProgressEvent<FileReader>) => {
          this.images.push({
            file,
            preview: String(event.target?.result || '')
          });
        };

        reader.readAsDataURL(file);
      });
  }

  private createListingFormData(): FormData {
    const formData = new FormData();
    const userId = localStorage.getItem('userId') || '2';

    formData.append('title', this.form.title);
    formData.append('description', this.form.description || 'No description provided');
    formData.append('price', String(this.form.price));
    formData.append('rooms', String(this.form.rooms || 1));
    formData.append('location', this.form.city);
    formData.append('city', this.form.city);
    formData.append('category', this.form.category);
    formData.append('type', this.form.type);
    formData.append('area', String(this.form.area || 0));
    formData.append('owner', userId);
    formData.append('is_available', 'true');

    this.images.forEach(img => {
      formData.append('images', img.file, img.file.name);
    });

    return formData;
  }

  private resetForm() {
    this.form = {
      title: '',
      price: null,
      city: '',
      description: '',
      rooms: null,
      area: null,
      category: 'buy',
      type: 'Apartment'
    };
    this.images = [];
  }
}
