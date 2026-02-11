import { Injectable, PLATFORM_ID, Inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from '../../environments/environment';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  role: string;
  roleId: number;
  message?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly TOKEN_KEY = 'auth_token';
  private readonly USER_KEY = 'auth_user';
  private currentUserSubject = new BehaviorSubject<any>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  public get currentUserValue(): any {
    return this.currentUserSubject.value;
  }

  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    if (isPlatformBrowser(this.platformId)) {
      const userJson = localStorage.getItem(this.USER_KEY);
      if (userJson) {
        try {
          this.currentUserSubject.next(JSON.parse(userJson));
        } catch (e) {
          localStorage.removeItem(this.USER_KEY);
        }
      }
    }
  }

  login(credentials: LoginRequest): Observable<any> {
    // Calling the specific backend endpoint: api/Login/login
    return this.http.post<any>(`${environment.apiUrl}/Login/login`, credentials)
      .pipe(
        tap(response => {
          // Backend returns: { message, role, roleId, token }
          // Properties might be PascalCase or camelCase depending on JSON serializer settings
          const token = response.token || response.Token;
          const role = response.role || response.Role;
          const roleId = response.roleId || response.RoleId;

          if (token) {
            this.setToken(token);
            const user = {
              id: roleId,
              role: role,
              email: credentials.email
            };
            this.setUser(user);
          }
        })
      );
  }

  setUser(user: any): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem(this.USER_KEY, JSON.stringify(user));
    }
    this.currentUserSubject.next(user);
  }

  logout(skipApi: boolean = false): void {
    const token = this.getToken(); // Capture token before clearing

    if (!skipApi && token) {
      // Attempt to notify backend about logout with the captured token
      // We manually add the header to be 100% sure it's sent regardless of interceptor state
      this.http.post(`${environment.apiUrl}/Logout/logout`, {}, {
        headers: { 'Authorization': `Bearer ${token}` }
      }).subscribe({
        next: () => console.log('Backend logout successful'),
        error: (err) => console.error('Backend logout error', err)
      });
    }

    // Proactively clear session
    this.clearSession();
  }

  private clearSession(): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem(this.TOKEN_KEY);
      localStorage.removeItem(this.USER_KEY);
    }
    this.currentUserSubject.next(null);
  }

  getToken(): string | null {
    if (isPlatformBrowser(this.platformId)) {
      return localStorage.getItem(this.TOKEN_KEY);
    }
    return null;
  }

  setToken(token: string): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem(this.TOKEN_KEY, token);
    }
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  getUserRole(): string {
    return this.currentUserValue?.role?.toLowerCase() || '';
  }

  requestOtp(email: string): Observable<any> {
    return this.http.post(`${environment.apiUrl}/newforgetpassword/requestotp`, { Username: email });
  }

  resetPassword(data: { email: string; otp: string; newPassword: string }): Observable<any> {
    const payload = {
      Username: data.email,
      Otp: data.otp,
      NewPassword: data.newPassword
    };
    return this.http.post(`${environment.apiUrl}/newforgetpassword/verifyotpandresetpassword`, payload);
  }
}
