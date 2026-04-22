import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { catchError, throwError, Observable, BehaviorSubject, tap } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ApiService {
  private readonly apiUrl = 'http://localhost:8000/api';

  private readonly loggedInSubject = new BehaviorSubject<boolean>(this.hasToken());
  public isLoggedIn$ = this.loggedInSubject.asObservable();

  constructor(private readonly http: HttpClient) {}

  private hasToken(): boolean {
    return !!localStorage.getItem('token');
  }

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({ 'Authorization': `Token ${token}` });
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    let message = 'An error occurred';
    if (error.error instanceof ErrorEvent) {
      message = error.error.message;
    } else {
      // Показываем конкретное сообщение от сервера если есть
      message = error.error?.error
        ?? error.error?.detail
        ?? error.error?.username?.[0]
        ?? `Server error ${error.status}`;
    }
    console.error('[ApiService]', message, error);
    return throwError(() => new Error(message));
  }

  // ── Auth ────────────────────────────────────────────────────────────────

  login(credentials: { username: string; password: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/login/`, credentials).pipe(
      tap((res: any) => {
        if (res?.token) {
          localStorage.setItem('token',    res.token);
          localStorage.setItem('userId',   res.user_id);
          localStorage.setItem('username', res.username);
          localStorage.setItem('email',    res.email ?? '');
          this.loggedInSubject.next(true);
        }
      }),
      catchError((err) => this.handleError(err))
    );
  }

  register(data: { username: string; password: string; email?: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/register/`, data).pipe(
      tap((res: any) => {
        if (res?.token) {
          localStorage.setItem('token',    res.token);
          localStorage.setItem('userId',   res.user_id);
          localStorage.setItem('username', res.username);
          localStorage.setItem('email',    res.email ?? '');
          this.loggedInSubject.next(true);
        }
      }),
      catchError((err) => this.handleError(err))
    );
  }

  logout(): void {
    const headers = this.getAuthHeaders();
    this.http.post(`${this.apiUrl}/logout/`, {}, { headers }).subscribe({
      next:  () => this.clearSession(),
      error: () => this.clearSession(),
    });
  }

  private clearSession(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('username');
    localStorage.removeItem('email');
    this.loggedInSubject.next(false);
  }

  getCurrentUser(): Observable<any> {
    return this.http.get(`${this.apiUrl}/me/`, {
      headers: this.getAuthHeaders()
    }).pipe(catchError((err) => this.handleError(err)));
  }

  updateCurrentUser(data: { username?: string; email?: string; phone?: string; city?: string }): Observable<any> {
    return this.http.patch(`${this.apiUrl}/me/`, data, {
      headers: this.getAuthHeaders()
    }).pipe(catchError((err) => this.handleError(err)));
  }

  // ── Properties ──────────────────────────────────────────────────────────

  getProperties(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/properties/`).pipe(
      catchError((err) => this.handleError(err))
    );
  }

  getProperty(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/properties/${id}/`).pipe(
      catchError((err) => this.handleError(err))
    );
  }

  createProperty(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/properties/create/`, data, {
      headers: this.getAuthHeaders()
    }).pipe(catchError((err) => this.handleError(err)));
  }

  searchProperties(query: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/properties/?search=${query}`).pipe(
      catchError((err) => this.handleError(err))
    );
  }

  getUserProperties(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/properties/my/`, {
      headers: this.getAuthHeaders()
    }).pipe(catchError((err) => this.handleError(err)));
  }

  deleteProperty(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/properties/${id}/`, {
      headers: this.getAuthHeaders()
    }).pipe(catchError((err) => this.handleError(err)));
  }

  publishProperty(id: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/properties/${id}/publish/`, {}, {
      headers: this.getAuthHeaders()
    }).pipe(catchError((err) => this.handleError(err)));
  }

  unpublishProperty(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/properties/${id}/publish/`, {
      headers: this.getAuthHeaders()
    }).pipe(catchError((err) => this.handleError(err)));
  }

  createBooking(bookingData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/bookings/`, bookingData, {
      headers: this.getAuthHeaders()
    }).pipe(catchError((err) => this.handleError(err)));
  }
}
