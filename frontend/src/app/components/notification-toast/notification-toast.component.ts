import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { NotificationService } from '../../services/notification.service';

@Component({
  selector: 'app-notification-toast',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './notification-toast.component.html',
  styleUrls: ['./notification-toast.component.css']
})
export class NotificationToastComponent {
  notification$ = this.notificationService.notification$;

  constructor(private readonly notificationService: NotificationService) {}

  close() {
    this.notificationService.close();
  }
}
