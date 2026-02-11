import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
    selector: 'app-login',
    standalone: false,
    templateUrl: './login.html',
    styleUrl: './login.scss'
})
export class Login implements OnInit {
    loginData = {
        email: '',
        password: ''
    };
    isLoading = false;
    showPassword = false;
    errorMessage = '';

    constructor(
        private authService: AuthService,
        private router: Router,
        private cdr: ChangeDetectorRef
    ) { }

    ngOnInit(): void {
        if (this.authService.isAuthenticated()) {
            this.router.navigate(['/']);
        }
    }

    onLogin(): void {
        if (!this.loginData.email || !this.loginData.password) {
            this.errorMessage = 'Please enter both email and password.';
            return;
        }

        this.isLoading = true;
        this.errorMessage = '';

        this.authService.login(this.loginData).subscribe({
            next: (res) => {
                this.isLoading = false;
                const role = res.role || res.Role || '';
                if (role.toLowerCase() === 'admin') {
                    this.router.navigate(['/admin-dashboard']);
                } else {
                    this.router.navigate(['/']);
                }
                this.cdr.detectChanges();
            },
            error: (err) => {
                this.isLoading = false;
                console.error('Login error', err);
                // Backend returns "Invalid email or password." for 401 Unauthorized
                this.errorMessage = err.error || 'Login failed. Please check your credentials.';
                this.cdr.detectChanges();
            }
        });
    }
    isForgotPassword = false;
    forgotPasswordStep = 1;
    forgotPasswordData = {
        email: '',
        otp: '',
        newPassword: '',
        confirmPassword: ''
    };
    successMessage = '';
    showNewPassword = false;
    showConfirmPassword = false;

    toggleForgotPassword(): void {
        this.isForgotPassword = !this.isForgotPassword;
        this.errorMessage = '';
        this.successMessage = '';
        this.forgotPasswordStep = 1;
        this.forgotPasswordData = { email: '', otp: '', newPassword: '', confirmPassword: '' };
        this.cdr.detectChanges();
    }

    onRequestOtp(): void {
        if (!this.forgotPasswordData.email) {
            this.errorMessage = 'Please enter your email.';
            return;
        }

        this.isLoading = true;
        this.errorMessage = '';
        this.successMessage = '';

        this.authService.requestOtp(this.forgotPasswordData.email).subscribe({
            next: (res) => {
                this.isLoading = false;
                this.forgotPasswordStep = 2; // Move to OTP step
                this.successMessage = 'OTP sent successfully to your email.';
                this.cdr.detectChanges();
            },
            error: (err) => {
                this.isLoading = false;
                this.errorMessage = err.error?.message || err.error || 'Failed to send OTP. Please try again.';
                this.cdr.detectChanges();
            }
        });
    }

    onVerifyOtp(): void {
        if (!this.forgotPasswordData.otp) {
            this.errorMessage = 'Please enter the OTP.';
            return;
        }
        // Since there is no separate verify-otp endpoint provided, we move to the next step
        // The actual verification will happen during password reset
        this.errorMessage = '';
        this.successMessage = '';
        this.forgotPasswordStep = 3; // Move to Password step
        this.cdr.detectChanges();
    }

    onResetPassword(): void {
        if (!this.forgotPasswordData.email || !this.forgotPasswordData.otp || !this.forgotPasswordData.newPassword || !this.forgotPasswordData.confirmPassword) {
            this.errorMessage = 'All fields are required.';
            return;
        }

        if (this.forgotPasswordData.newPassword !== this.forgotPasswordData.confirmPassword) {
            this.errorMessage = 'Passwords do not match.';
            return;
        }

        this.isLoading = true;
        this.errorMessage = '';
        this.successMessage = '';

        this.authService.resetPassword(this.forgotPasswordData).subscribe({
            next: (res) => {
                this.isLoading = false;
                this.successMessage = 'Password reset successfully. You can now login.';
                this.cdr.detectChanges();
                setTimeout(() => {
                    this.toggleForgotPassword();
                    this.cdr.detectChanges();
                }, 2000);
            },
            error: (err) => {
                this.isLoading = false;
                this.errorMessage = err.error?.message || err.error || 'Failed to reset password. Please check your OTP and try again.';
                this.cdr.detectChanges();
            }
        });
    }
}
