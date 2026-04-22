import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ApiService } from './api.service';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private readonly fallbackUser: User = {
    id: localStorage.getItem('userId') || '',
    name: localStorage.getItem('username') || 'User',
    email: localStorage.getItem('email') || '',
    phone: '',
    city: ''
  };

  private readonly currentUserSubject = new BehaviorSubject<User>(this.fallbackUser);

  currentUser$ = this.currentUserSubject.asObservable();

  constructor(private readonly apiService: ApiService) {
    this.syncFromStorage();

    if (localStorage.getItem('token')) {
      this.loadCurrentUser();
    }
  }

  get currentUser(): User {
    return this.currentUserSubject.value;
  }

  updateUser(user: Partial<User>) {
    const nextUser = {
      ...this.currentUserSubject.value,
      ...user
    };

    this.currentUserSubject.next(nextUser);
    this.persistUser(nextUser);
  }

  applyApiUser(user: { id?: string | number; username?: string; email?: string; phone?: string; city?: string }): void {
    this.updateUser({
      id: String(user.id ?? this.currentUser.id ?? ''),
      name: user.username || this.currentUser.name,
      email: user.email || '',
      phone: user.phone || '',
      city: user.city || ''
    });
  }

  loadCurrentUser(): void {
    this.apiService.getCurrentUser().subscribe({
      next: (user) => this.applyApiUser(user),
      error: () => {
        this.syncFromStorage();
      }
    });
  }

  private syncFromStorage(): void {
    this.currentUserSubject.next({
      id: localStorage.getItem('userId') || '',
      name: localStorage.getItem('username') || 'User',
      email: localStorage.getItem('email') || '',
      phone: '',
      city: ''
    });
  }

  private persistUser(user: User): void {
    localStorage.setItem('userId', user.id || '');
    localStorage.setItem('username', user.name || '');
    localStorage.setItem('email', user.email || '');
  }
}
