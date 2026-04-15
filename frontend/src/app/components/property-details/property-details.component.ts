import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../../services/api.service';

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

  constructor(
    private route: ActivatedRoute, 
    public router: Router,
    private apiService: ApiService
  ) {}

  ngOnInit(): void {
    this.propertyId = Number(this.route.snapshot.paramMap.get('id'));
  }

  onBook(): void {
    if (!this.bookingDate) {
      alert('Please select a booking date.');
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
        alert('Booking successful!');
        this.router.navigate(['/home']);
      },
      error: () => {
        alert('Booking failed. Please login first.');
        this.isSubmitting = false;
      }
    });
  }
}
