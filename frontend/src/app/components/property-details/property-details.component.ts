import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { LanguageService } from '../../services/language.service';

@Component({
  selector: 'app-property-details',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './property-details.component.html',
  styleUrl: './property-details.component.css'
})
export class PropertyDetailsComponent implements OnInit {
  propertyId: number | null = null;
  bookingDate = '';
  isSubmitting = false;
  lang: 'en' | 'ru' = 'en';

  constructor(
    private route: ActivatedRoute, 
    public router: Router,
    private apiService: ApiService,
    private langService: LanguageService
  ) {
    this.lang = this.langService.currentLang;
    this.langService.lang$.subscribe(l => this.lang = l);
  }

  ngOnInit(): void {
    this.propertyId = Number(this.route.snapshot.paramMap.get('id'));
  }

  onBook(): void {
    if (!this.bookingDate) {
      alert(this.lang === 'ru' ? 'Пожалуйста, выберите дату бронирования.' : 'Please select a booking date.');
      return;
    }
    
    this.isSubmitting = true;
    const payload = {
      property: this.propertyId,
      start_date: this.bookingDate,
      end_date: this.bookingDate
    };

    this.apiService.createBooking(payload).subscribe({
      next: () => {
        alert(this.lang === 'ru' ? 'Бронирование успешно!' : 'Booking successful!');
        this.router.navigate(['/home']);
      },
      error: () => {
        alert(this.lang === 'ru' ? 'Не удалось забронировать. Сначала войдите в аккаунт.' : 'Booking failed. Please login first.');
        this.isSubmitting = false;
      }
    });
  }
}
