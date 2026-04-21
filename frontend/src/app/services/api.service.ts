import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, throwError, Observable, BehaviorSubject, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private readonly apiUrl = 'http://localhost:8000/api';
  
  private readonly loggedInSubject = new BehaviorSubject<boolean>(this.hasToken());
  public isLoggedIn$ = this.loggedInSubject.asObservable();

  constructor(private readonly http: HttpClient) { }

  private hasToken(): boolean {
    return !!localStorage.getItem('token');
  }

  // ИСПРАВЛЕНИЕ R2: Теперь мы видим детали ошибки в консоли
  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'An error occurred';
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Client Error: ${error.error.message}`;
    } else {
      errorMessage = `Server Error: ${error.status}\nMessage: ${error.message}`;
    }
    console.error(errorMessage);
    return throwError(() => new Error(errorMessage));
  }

  login(credentials: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/login/`, credentials).pipe(
      tap((res: any) => {
        if(res?.token) {
          localStorage.setItem('token', res.token);
          this.loggedInSubject.next(true);
        }
      }),
      catchError(this.handleError)
    );
  }

  // ИСПРАВЛЕНИЕ C7: Добавляем вызов бэкенда при выходе (опционально, но правильно)
  logout(): void {
    this.http.post(`${this.apiUrl}/logout/`, {}).subscribe({
      next: () => this.clearSession(),
      error: () => this.clearSession() // Даже если бэк упал, чистим локально
    });
  }

  private clearSession() {
    localStorage.removeItem('token');
    this.loggedInSubject.next(false);
  }

  // ИСПРАВЛЕНИЕ I1: Получить ВСЕ объявления
  getProperties(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/properties/`).pipe(
      catchError(this.handleError)
    );
  }

  // ИСПРАВЛЕНИЕ I3: Получить ОДНО объявление по ID
  getProperty(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/properties/${id}/`).pipe(
      catchError(this.handleError)
    );
  }

  // ИСПРАВЛЕНИЕ I4: Создать новое объявление
  createProperty(propertyData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/properties/create/`, propertyData).pipe(
      catchError(this.handleError)
    );
  }

  searchProperties(query: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/properties/?search=${query}`).pipe(
      catchError(this.handleError)
    );
  }

  deleteProperty(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/properties/${id}/update/`).pipe(
      catchError(this.handleError)
    );
  }

  createBooking(bookingData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/bookings/`, bookingData).pipe(
      catchError(this.handleError)
    );
  }
}