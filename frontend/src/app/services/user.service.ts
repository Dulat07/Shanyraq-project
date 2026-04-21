import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private readonly currentUserSubject = new BehaviorSubject<User>({
    id: 'user-1',
    name: 'Shanyraq User',
    email: 'user@shanyraq.kz',
    phone: '+7 777 123 45 67',
    city: 'Almaty'
  });

  currentUser$ = this.currentUserSubject.asObservable();

  get currentUser(): User {
    return this.currentUserSubject.value;
  }

  updateUser(user: Partial<User>) {
    this.currentUserSubject.next({
      ...this.currentUserSubject.value,
      ...user
    });
  }
}
