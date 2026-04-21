import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ListingCardComponent } from '../../listing-card/listing-card.component';
import { ListingsService } from '../../../services/listings.service';

@Component({
  selector: 'app-account-my-listings',
  standalone: true,
  imports: [CommonModule, RouterLink, ListingCardComponent],
  templateUrl: './my-listings.component.html',
  styleUrls: ['./account-tab.component.css']
})
export class MyListingsComponent {
  listings$ = this.listingsService.myListings$;

  constructor(private listingsService: ListingsService) {}
}
