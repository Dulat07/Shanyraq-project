import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-account-page',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, RouterOutlet],
  templateUrl: './account-page.component.html',
  styleUrls: ['./account-page.component.css']
})
export class AccountPageComponent implements OnInit {
  user$ = this.userService.currentUser$;

  tabs = [
    { label: 'My Listings', path: '/account' },
    { label: 'Favorites', path: '/account/favorites' },
    { label: 'Recently Viewed', path: '/account/recent' },
    { label: 'Settings', path: '/account/settings' }
  ];

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.userService.loadCurrentUser();
  }
}
