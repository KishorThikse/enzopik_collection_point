import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
    selector: 'app-admin-login',
    standalone: false,
    templateUrl: './admin-login.html',
    styleUrl: './admin-login.scss'
})
export class AdminLogin {
    loginData = {
        email: '',
        password: ''
    };
    isLoading = false;
    showPassword = false;
    errorMessage = '';

    constructor(
        private authService: AuthService,
        private router: Router
    ) { }

    onLogin(): void {
        if (!this.loginData.email || !this.loginData.password) {
            this.errorMessage = 'Please enter admin credentials.';
            return;
        }

        this.isLoading = true;
        this.errorMessage = '';

        this.authService.login(this.loginData).subscribe({
            next: async (res) => {
                const role = res.role || res.Role || '';
                const isAdmin = role.toLowerCase() === 'admin';

                if (isAdmin) {
                    await this.router.navigate(['/admin-dashboard']);
                    this.isLoading = false;
                } else {
                    this.isLoading = false;
                    this.authService.logout();
                    this.errorMessage = 'Access denied. Only administrators can login here.';
                }
            },
            error: (err) => {
                this.isLoading = false;
                this.errorMessage = err.error?.message || err.error || 'Login failed. Please check your credentials.';
            }
        });
    }
}
