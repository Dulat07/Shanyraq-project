import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http'; // Добавили HttpHeaders
import { catchError, throwError, Observable, BehaviorSubject, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private readonly apiUrl = 'http://localhost:8000/api';
  
  private readonly loggedInSubject = new BehaviorSubject<boolean>(this.hasToken());
  public isLoggedIn$ = this.loggedInSubject.asObservable();

  constructor(private readonly http: HttpClient) { }

  // Проверка наличия токена
  private hasToken(): boolean {
    return !!localStorage.getItem('token');
  }

  // Вспомогательный метод для создания заголовков с токеном
  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Authorization': `Token ${token}` // ИСПРАВЛЕНИЕ C4: заменяем Bearer на Token
    });
  }

  // Обработка ошибок
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

  // Авторизация
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

  // Выход из системы
  logout(): void {
    const headers = this.getAuthHeaders();
    this.http.post(`${this.apiUrl}/logout/`, {}, { headers }).subscribe({
      next: () => this.clearSession(),
      error: () => this.clearSession() 
    });
  }

  private clearSession() {
    localStorage.removeItem('token');
    this.loggedInSubject.next(false);
  }

  // Получить ВСЕ объявления (обычно доступно всем)
  getProperties(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/properties/`).pipe(
      catchError(this.handleError)
    );
  }

  // Получить ОДНО объявление
  getProperty(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/properties/${id}/`).pipe(
      catchError(this.handleError)
    );
  }

  // СОЗДАНИЕ (Теперь с токеном!)
  createProperty(propertyData: any): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.post(`${this.apiUrl}/properties/create/`, propertyData, { headers }).pipe(
      catchError(this.handleError)
    );
  }

  // Поиск
  searchProperties(query: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/properties/?search=${query}`).pipe(
      catchError(this.handleError)
    );
  }

  // УДАЛЕНИЕ (Теперь с токеном!)
  deleteProperty(id: number): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.delete(`${this.apiUrl}/properties/${id}/update/`, { headers }).pipe(
      catchError(this.handleError)
    );
  }

  // БРОНИРОВАНИЕ (Теперь с токеном!)
  createBooking(bookingData: any): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.post(`${this.apiUrl}/bookings/`, bookingData, { headers }).pipe(
      catchError(this.handleError)
    );
  }
}