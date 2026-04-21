import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ListingCardComponent } from '../../listing-card/listing-card.component';
import { RecentService } from '../../../services/recent.service';

@Component({
  selector: 'app-account-recent',
  standalone: true,
  imports: [CommonModule, ListingCardComponent],
  templateUrl: './recent.component.html',
  styleUrls: ['./account-tab.component.css']
})
export class AccountRecentComponent {
  recent = this.recentService.getAll();

  constructor(private recentService: RecentService) {}
}
