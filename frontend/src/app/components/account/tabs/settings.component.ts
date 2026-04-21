import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { UserService } from '../../../services/user.service';

@Component({
  selector: 'app-account-settings',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './settings.component.html',
  styleUrls: ['./account-tab.component.css']
})
export class SettingsComponent {
  user$ = this.userService.currentUser$;

  constructor(private userService: UserService) {}
}
