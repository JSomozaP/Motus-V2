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
    // VÉRIFIER QUE LE TOKEN EXISTE
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    this.isLoggedInSubject.next(!!token && !!user);
  }

  register(pseudo: string, email: string, password: string): Observable<any> {
    return this.http.post('http://localhost:3000/api/auth/register', { pseudo, email, password });
  }

  login(email: string, password: string): Observable<any> {
    return this.http.post('http://localhost:3000/api/auth/login', { email, password }).pipe(
      tap((response: any) => {
        if (response.token) {
          // STOCKER AVEC UN SEUL NOM DE CLÉ
          localStorage.setItem('token', response.token);
          localStorage.setItem('user', JSON.stringify(response.user));
          // METTRE À JOUR LE SUBJECT
          this.isLoggedInSubject.next(true);
        }
      })
    );
  }

  verify(token: string): Observable<any> {
    return this.http.get(`http://localhost:3000/api/auth/verify/${token}`);
  }

  logout(): void {
    // NETTOYER TOUS LES TOKENS
    localStorage.removeItem('token');
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    localStorage.removeItem('emailVerified');
    this.isLoggedInSubject.next(false);
  }

  setToken(token: string) {
    localStorage.setItem('token', token);
    this.isLoggedInSubject.next(true);
  }

  setUser(user: any) {
    localStorage.setItem('user', JSON.stringify(user));
    console.log('💾 Utilisateur stocké avec succès');
  }

  getUser() {
    const userData = localStorage.getItem('user');
    return userData ? JSON.parse(userData) : null;
  }

  getCurrentUserPseudo(): string {
    const user = this.getUser();
    return user?.pseudo || 'Joueur';
  }

  getToken(): string | null {
    
    return localStorage.getItem('token');
  }

  
  isAuthenticated(): boolean {
    const token = this.getToken();
    const user = this.getUser();
    const isAuth = !!token && !!user;
    
    return isAuth;
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
