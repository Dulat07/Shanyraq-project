import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, throwError, Observable, BehaviorSubject, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiUrl = 'http://localhost:8000/api';
  
  private loggedInSubject = new BehaviorSubject<boolean>(this.hasToken());
  public isLoggedIn$ = this.loggedInSubject.asObservable();

  constructor(private http: HttpClient) { }

  private hasToken(): boolean {
    return !!localStorage.getItem('token');
  }

  private handleError(error: HttpErrorResponse) {
    console.error('API Error:', error.message);
    return throwError(() => new Error('An error occurred while communicating with the API.'));
  }

  login(credentials: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/login/`, credentials).pipe(
      tap((res: any) => {
        if(res && res.token) {
          localStorage.setItem('token', res.token);
          this.loggedInSubject.next(true);
        }
      }),
      catchError(this.handleError)
    );
  }

  logout(): void {
    localStorage.removeItem('token');
    this.loggedInSubject.next(false);
  }

  getProperties(): Observable<any> {
    return this.http.get(`${this.apiUrl}/properties/`).pipe(
      catchError(this.handleError)
    );
  }
  
  searchProperties(query: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/properties/?search=${query}`).pipe(
      catchError(this.handleError)
    );
  }

  deleteProperty(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/properties/${id}/`).pipe(
      catchError(this.handleError)
    );
  }

  createBooking(bookingData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/bookings/`, bookingData).pipe(
      catchError(this.handleError)
    );
  }
}
