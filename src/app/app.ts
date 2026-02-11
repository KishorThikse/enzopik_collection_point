import { Component, signal, ChangeDetectorRef } from '@angular/core';
import { AuthService } from './services/auth.service';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  standalone: false,
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('Enzopik-collection');

  constructor(
    private authService: AuthService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {
    // Check on initial load
    this.enforceSeparation();

    // Check on every navigation completion
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.enforceSeparation();
      this.cdr.detectChanges();
    });
  }

  enforceSeparation(): void {
    if (!this.isLoggedIn()) return;

    const role = this.authService.getUserRole();
    const url = this.router.url;

    // Define admin paths - ONLY the dashboard uses the admin-sidenav now
    const adminRoutes = ['/admin-dashboard'];
    const isAdminPath = adminRoutes.some(route => url.includes(route));
    const isAdminUser = (role === 'admin');

    // Scenario A: Admin on User pages -> Push to Admin Dashboard
    if (isAdminUser && !isAdminPath) {
      this.router.navigate(['/admin-dashboard']);
    }

    // Scenario B: User on Admin pages -> Push to Home
    if (!isAdminUser && isAdminPath) {
      this.router.navigate(['/home']);
    }
  }

  isLoggedIn(): boolean {
    return this.authService.isAuthenticated();
  }

  isAdminPage(): boolean {
    return this.router.url.includes('admin-dashboard');
  }

  isAdminLoginPage(): boolean {
    return this.router.url.includes('adminlogin');
  }
}
