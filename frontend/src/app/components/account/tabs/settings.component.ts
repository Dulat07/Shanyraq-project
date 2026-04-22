import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../../services/api.service';
import { UserService } from '../../../services/user.service';

@Component({
  selector: 'app-account-settings',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './settings.component.html',
  styleUrls: ['./account-tab.component.css']
})
export class SettingsComponent implements OnInit {
  form = {
    username: '',
    email: '',
    phone: '',
    city: ''
  };

  isSaving = false;
  successMessage = '';
  errorMessage = '';

  constructor(
    private readonly userService: UserService,
    private readonly apiService: ApiService
  ) {}

  ngOnInit(): void {
    this.userService.currentUser$.subscribe((user) => {
      this.form = {
        username: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        city: user.city || ''
      };
    });
  }

  saveSettings(): void {
    this.isSaving = true;
    this.successMessage = '';
    this.errorMessage = '';

    this.apiService.updateCurrentUser(this.form).subscribe({
      next: (user) => {
        this.userService.applyApiUser(user);
        this.form = {
          username: user.username || '',
          email: user.email || '',
          phone: user.phone || '',
          city: user.city || ''
        };
        this.successMessage = 'Profile updated successfully.';
        this.isSaving = false;
      },
      error: (err: Error) => {
        this.errorMessage = err.message || 'Failed to update profile.';
        this.isSaving = false;
      }
    });
  }
}
