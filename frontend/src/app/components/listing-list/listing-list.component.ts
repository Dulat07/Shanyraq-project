import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { Listing } from '../../models/listing.model';
import { ListingCardComponent } from '../listing-card/listing-card.component';

@Component({
  selector: 'app-listing-list',
  standalone: true,
  imports: [CommonModule, ListingCardComponent],
  templateUrl: './listing-list.component.html',
  styleUrls: ['./listing-list.component.css']
})
export class ListingListComponent {
  @Input() listings: Listing[] = [];
}