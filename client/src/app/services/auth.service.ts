import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private isLoggedInSubject = new BehaviorSubject<boolean>(false);
  public isLoggedIn$ = this.isLoggedInSubject.asObservable();
  private apiUrl = 'http://localhost:3000/api';

  constructor(private http: HttpClient) {
    // Vérifier si token existe au démarrage
    const token = localStorage.getItem('authToken');
    const emailVerified = localStorage.getItem('emailVerified');
    this.isLoggedInSubject.next(!!token && emailVerified === 'true');
  }

  // Remplacement TEMPORAIRE par des URLs complètes :
  register(email: string, password: string): Observable<any> {
    return this.http.post('http://localhost:3000/api/auth/register', { email, password });
  }

  login(email: string, password: string): Observable<any> {
    return this.http.post('http://localhost:3000/api/auth/login', { email, password }).pipe(
      tap((response: any) => {
        // Sauvegarder le token
        if (response.token) {
          localStorage.setItem('authToken', response.token);
          localStorage.setItem('user', JSON.stringify(response.user));
        }
      })
    );
  }

  verify(token: string): Observable<any> {
    return this.http.get(`http://localhost:3000/api/auth/verify/${token}`);
  }

  logout(): void {
    localStorage.removeItem('authToken');
    localStorage.removeItem('emailVerified');
    this.isLoggedInSubject.next(false);
  }

  setToken(token: string): void {
    localStorage.setItem('authToken', token);
    localStorage.setItem('emailVerified', 'true');
    this.isLoggedInSubject.next(true);
  }

  getToken(): string | null {
    return localStorage.getItem('token'); // Récupérer depuis localStorage
  }

  isAuthenticated(): boolean {
    const token = this.getToken();
    const emailVerified = localStorage.getItem('emailVerified');
    return !!token && emailVerified === 'true';
  }

  
  forgotPassword(email: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/forgot-password`, { email });
  }

  
  resetPassword(token: string, newPassword: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/reset-password`, { 
      token, 
      newPassword 
    });
  }
}
