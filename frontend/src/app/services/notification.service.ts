import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface NotificationMessage {
  id: number;
  message: string;
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private hideTimer?: ReturnType<typeof setTimeout>;
  private readonly notificationSubject = new BehaviorSubject<NotificationMessage | null>(null);

  notification$ = this.notificationSubject.asObservable();

  show(message: string) {
    this.hideTimer && clearTimeout(this.hideTimer);
    this.notificationSubject.next({
      id: Date.now(),
      message
    });
    this.hideTimer = setTimeout(() => this.close(), 3000);
  }

  close() {
    this.hideTimer && clearTimeout(this.hideTimer);
    this.notificationSubject.next(null);
  }
}
