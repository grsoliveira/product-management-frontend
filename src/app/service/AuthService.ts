// src/app/service/auth.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl = '/api/v1/auth';
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  constructor(
    private http: HttpClient,
    private router: Router
  ) {
    // Verifica se já existe um token salvo ao iniciar o serviço
    this.checkAuthStatus();
  }

  private checkAuthStatus(): void {
    const token = this.getStoredToken();
    if (token) {
      this.isAuthenticatedSubject.next(true);
    }
  }

  login(username: string, password: string): Observable<any> {
    const authHeader = 'Basic ' + btoa(username + ':' + password);
    const headers = new HttpHeaders({
      'Authorization': authHeader,
      'Content-Type': 'application/json'
    });

    return this.http.post(`${this.baseUrl}/login`, {}, { headers }).pipe(
      tap(() => {
        this.storeToken(authHeader);
        this.isAuthenticatedSubject.next(true);
      })
    );
  }

  logout(): void {
    sessionStorage.removeItem('auth_token');
    this.isAuthenticatedSubject.next(false);
    this.router.navigate(['/login']);
  }

  isAuthenticated(): boolean {
    return this.isAuthenticatedSubject.value;
  }

  getAuthHeader(): HttpHeaders {
    const token = this.getStoredToken();
    return new HttpHeaders({
      'Authorization': token || '',
      'Content-Type': 'application/json'
    });
  }

  private storeToken(token: string): void {
    sessionStorage.setItem('auth_token', token);
  }

  private getStoredToken(): string | null {
    return sessionStorage.getItem('auth_token');
  }
}
