import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { filter } from 'rxjs/operators';

@Component({
    selector: 'app-admin-sidenav',
    standalone: false,
    templateUrl: './admin-sidenav.html',
    styleUrl: './admin-sidenav.scss'
})
export class AdminSidenav implements OnInit {
    activeRoute: string = 'admin-dashboard';
    userName: string = 'Admin User';
    userEmail: string = '';
    today: Date = new Date();

    constructor(
        private router: Router,
        private authService: AuthService
    ) { }

    ngOnInit(): void {
        this.setActiveRoute();
        this.authService.currentUser$.subscribe(user => {
            if (user) {
                this.userName = user.name || user.UserName || 'Admin';
                this.userEmail = user.email || user.Email || '';
            }
        });

        this.router.events.pipe(
            filter(event => event instanceof NavigationEnd)
        ).subscribe(() => {
            this.setActiveRoute();
        });
    }

    setActiveRoute(): void {
        const url = this.router.url;
        if (url.includes('admin-dashboard')) this.activeRoute = 'dashboard';
        if (url.includes('sub-agent')) this.activeRoute = 'sub-agent';
        if (url.includes('restaurant')) this.activeRoute = 'restaurant';
        if (url.includes('agent')) this.activeRoute = 'agent';
        if (url.includes('oil') || url.includes('orders')) this.activeRoute = 'orders';
        if (url.includes('nearest-order')) this.activeRoute = 'nearest-order';
    }

    navigateTo(route: string): void {
        this.router.navigate([`/${route}`]);
    }

    logout(): void {
        this.authService.logout();
        this.router.navigate(['/adminlogin']);
    }
}
