import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { Listing } from '../../models/listing.model';

@Component({
  selector: 'app-listing-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './listing-card.component.html',
  styleUrls: ['./listing-card.component.css']
})
export class ListingCardComponent {
  @Input() listing!: Listing;
}