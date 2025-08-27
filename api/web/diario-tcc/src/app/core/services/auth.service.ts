import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { tap, map } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly tokenKey = 'auth_token';
  private loggedIn = signal(false);

  constructor(private http: HttpClient) {
    const token = typeof localStorage !== 'undefined' ? localStorage.getItem(this.tokenKey) : null;
    this.loggedIn.set(!!token);
  }

  /** Simulated login. Replace with real API call when backend is ready. */
  login(email: string, password: string): Observable<boolean> {
    // return this.http.post<{ token: string }>('/api/login', { email, password }).pipe(
    //   tap((res) => this.setToken(res.token)),
    //   map(() => true)
    // );
    return of({ token: 'mock-token' }).pipe(
      tap((res) => this.setToken(res.token)),
      map(() => true)
    );
  }

  logout(): void {
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem(this.tokenKey);
    }
    this.loggedIn.set(false);
  }

  isLoggedIn() {
    return this.loggedIn();
  }

  private setToken(token: string) {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(this.tokenKey, token);
    }
    this.loggedIn.set(true);
  }
}
